var dayjs = require('dayjs')

// require internationalisation packs
var localizedFormat = require('dayjs/plugin/localizedFormat')
dayjs.extend(localizedFormat)
require('dayjs/locale/da')
require('dayjs/locale/de')
require('dayjs/locale/es')
require('dayjs/locale/fr')
require('dayjs/locale/it')
require('dayjs/locale/nl')
require('dayjs/locale/pl')
require('dayjs/locale/se')
require('dayjs/locale/sk')

// require isoweek to create dayjs objects for days
var isoWeek = require('dayjs/plugin/isoWeek')
dayjs.extend(isoWeek)

window.dayjs = dayjs

import CSMultiSelect from './components/csMultiSelect'
window.CSMultiSelect = CSMultiSelect
document.addEventListener('alpine:init', () => {
	Alpine.data('CSMultiSelect', CSMultiSelect)
})

// our main json feed object
window.CS = function(options = {}) {
	return {
		// Configuration & Options
		configuration: {}, // the embed configuration
		filterKeys: [], // the names of the filters for this feed
		locale: 'en', // the locale for DateTimes
		options: {}, // options for fetching json
		resourceModule: '', // the module we're in
		url: '', // the churchsuite account url

		// Model Data
		models: [], // our filtered model objects
		modelsAll: [], // all of our model objects

		/**
		 * To be overwritten by child classes.
		 * Builds/initialises a model object, using the given data object.
		 */
		buildModelObject(model) {
			return model
		},

		/**
		 * Builds any URL options provided
		 */
		buildOptions(options) {
			var searchOptions = new URLSearchParams()
			Object.keys(options).forEach(function(key) {
				searchOptions.append(key, options[key])
			})
			return (Object.keys(options).length !== 0) ? '?' + searchOptions.toString() : ''
		},

		/**
		 * Takes a model (e.g. site, cluster, tag etc.) and adds an option id and name to a particular key array
		 */
		buildIdNameOption(key, model) {
			// see if we've got a legacyKey in play (category/categories!)
			let legacyKey = arguments.length > 2 ? arguments[2] : key+'s'

			// check the model exists
			if (model == null) return;

			let options = this[key+'Options']
			let optionIds = options.map(o => o.id)
			if (!optionIds.includes(model.id)) {
				// populate id and name options array
				this[key+'Options'].push({
					id: model.id,
					name: model.name,
				})
				// populate legacy key with just name options
				this[legacyKey].push(model.name)
			}
		},

		/**
		 * Returns the days of the week for dropdowns in whichever language - Sunday first
		 */
		 dayOfWeekOptions() {
			let dayOptions = []
			for(var i = 0; i < 7; i++) dayOptions.push({
				id: dayjs().isoWeekday(i).format('dddd'),
				name: dayjs().isoWeekday(i).format('dddd')
			})
			return dayOptions
		},

		/**
		 * Returns the days of the week for dropdowns in whichever language - Sunday first
		 */
		daysOfWeek() {
			let days = []
			for(var i = 0; i < 7; i++) days.push(dayjs().isoWeekday(i).format('dddd'))
			return days
		},

		/**
		 * Fetches JSON data from local cache (expiry 1h) or from ChurchSuite JSON feed.
		 * Type is 'calendar', 'churches' or 'smallgroups'.
		 */
		async fetchJSON(type, options = {}) {
			let data
			let version = options.hasOwnProperty('configuration') ? 'v2/' : ''
			let url = CS.url + '/embed/' + version + type + '/json' + this.buildOptions(options)

			// if the page has a preview=1 query, don't use cached data so changes are live updated
			let preview = (new URLSearchParams(location.search)).get('preview') == 1
			let storedData = this.supportsLocalStorage() && !preview ? localStorage.getItem(url) : null

			if (storedData != null && JSON.parse(storedData).expires > new Date().getTime()) {
				data = JSON.parse(storedData).json
			} else {
				await fetch(url)
					.then(response => response.json())
					.then(response => {
						if (this.supportsLocalStorage() && !preview) {
							try {
								localStorage.setItem(url, JSON.stringify({expires: (new Date()).getTime()+(1000*60*15), json: response})) // JS times in milliseconds, so expire in 15m
							} catch {
								console.error('Unable to cache data')
							}
						}
						data = response
					},
				)
			}

			return data
		},

		/**
		 * Returns true if the given model should be visible, based on the filters.
		 */
		filterModel(model) {
			return true
		},

		/**
		 * Returns true if we should be filtering models.
		 */
		filterModelsEnabled() {
			return true
		},

		/**
		 * Filters models based on the UI's filters.
		 */
		filterModels() {
			if (this.filterModelsEnabled()) {
				this.models = this.modelsAll.filter((model) => this.filterModel(model))
			}
			this.$dispatch('models-updated') // always do this!
		},

		/**
		 * Gets a filter value either as an array or null
		 * This also ignores 0 and '0' as values and returns null in place (for resetting selects)
		 */
		filterValue(key) {
			let parent = arguments.length > 1 ? arguments[1] : this
			let value = parent[key]
			let result = null

			if (Array.isArray(value)) {
				// it's an array - filter out empty values
				value = value.filter(v => (v !== 0 && v !== '0' && v !== null))
				// return the result if it's got length otherwise null
				result = value.length ? value : null
			} else if (value === null) {
				// always return null
				result = null
			} else if (typeof value === 'string' || value instanceof String) {
				// return the value as an array if it has length and isn't empty otherwise null
				result = value.length && value !== 0 && value !== '0' ? [value] : null
			}

			// if the result is null then reset the key reactively
			if (result == null) parent[key] = null

			// return the result
			return result;
		},

		/**
		 * Returns the rgba() colour to be used to style an element.
		 * @param {string} hexColor
		 * @param {string} tailwindVar
		 */
		getColorRbga(hexColor, tailwindVar) {
			const rgbColor = this.hexToRgb(hexColor)

			return 'rgba('+rgbColor.r+', '+rgbColor.g+', '+rgbColor.b+', var('+tailwindVar+'))'
		},

		/**
		 * Takes in a hex colour, returns the result as an object.
		 * @param {string} hex
		 * @returns object
		 */
		hexToRgb(hex) {
			const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)

			return result ? {
				r: parseInt(result[1], 16),
				g: parseInt(result[2], 16),
				b: parseInt(result[3], 16)
			} : null
		},

		/**
		 * Initialises the JSON feed asynchronously.
		 */
		async init() {
			dayjs.locale(this.locale)

			this.$watch(this.filterKeys, (v) => this.filterModels())

			let response = await this.fetchJSON(this.resourceModule, Object.assign(this.options, options))
			if (response.hasOwnProperty('configuration')) {
				// new style configuration data
				this.configuration = response.configuration
				this.mapConfiguration()

				response.data.forEach(model => {
					this.modelsAll.push(this.buildModelObject(model))
				})
			} else {
				// old style flat array
				response.forEach(model => {
					this.modelsAll.push(this.buildModelObject(model))
				})
			}

			this.postInit()

			this.$nextTick(() => this.filterModels())
		},

		/**
		 * This method maps the configuration settings over to json script options
		 */
		mapConfiguration() {},

		/**
		 * An empty function that runs at the end of the init() method for each module.
		 * Overload if you need to run code at the end of initialisation.
		 */
		postInit() {},

		/**
		 * Check that local storage works in browser
		 */
		supportsLocalStorage() {
			try {
				return 'localStorage' in window && window['localStorage'] !== null
			} catch {
				return false
			}
		}
	}
}