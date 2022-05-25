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

import CSEvents from './calendar/CSEvents'
window.CSEvents = CSEvents

// our main json feed object
window.CS = {
	locale: 'en', // the locale for DateTimes

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

		// detect URL scheme if not provided
		let scheme = ''
		if (!['http', 'https'].includes(CS.url.split('://')[0])) {
			scheme = ['charitysuite', 'churchsuite'].includes(CS.url.split('.').pop()) ? 'http://' : 'https://'
		}

		let url = scheme + CS.url + '/embed/' + version + type + '/json' + CS.buildOptions(options)

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