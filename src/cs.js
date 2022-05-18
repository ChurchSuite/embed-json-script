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
window.CSJsonFeed = function(options = {}) {
	return {
		// Configuration & Options
		configuration: [], // the embed configuration
		filterKeys: [], // the names of the filters for this feed
		locale: 'en', // the locale for DateTimes
		options: [], // options for fetching json
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
			let url = CSJsonFeed.url + '/embed/' + type + '/json' + this.buildOptions(options)

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