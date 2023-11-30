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
require('dayjs/locale/sk')
require('dayjs/locale/sv')

// require isoweek to create dayjs objects for days
var isoWeek = require('dayjs/plugin/isoWeek')
dayjs.extend(isoWeek)
var duration = require('dayjs/plugin/duration')
dayjs.extend(duration)
var utc = require('dayjs/plugin/utc')
dayjs.extend(utc)
var minMax = require('dayjs/plugin/minMax')
dayjs.extend(minMax)

window.dayjs = dayjs

import CSMultiSelect from './components/csMultiSelect'
window.CSMultiSelect = CSMultiSelect
document.addEventListener('alpine:init', () => {
	Alpine.data('CSMultiSelect', CSMultiSelect)
})

import CSBookedResources from './bookings/CSBookedResources'
window.CSBookedResources = CSBookedResources

import CSEvents from './calendar/CSEvents'
window.CSEvents = CSEvents

import CSGroups from './smallgroups/CSGroups'
window.CSGroups = CSGroups

import CSOrganisations from './network/CSOrganisations'
window.CSOrganisations = CSOrganisations

let scriptVersion = '4.3.1'

// our main json feed object
window.CS = {
	locale: 'en', // the locale for DateTimes

	/**
	 * Builds any URL options provided
	 */
	buildOptions(options) {
		var searchOptions = new URLSearchParams()
		Object.keys(options).forEach(function (key) {
			searchOptions.append(key, options[key])
		})
		return Object.keys(options).length !== 0 ? '?' + searchOptions.toString() : ''
	},

	/**
	 * Cache the JSON data in the browser local storage.
	 * @param {String} response The raw JSON response data
	 * @param {String} url The URL this JSON came from, to use as a key
	 */
	cacheJSONData(response, url) {
		try {
			localStorage.setItem(
				url,
				JSON.stringify({
					expires: new Date().getTime() + 1000 * 60 * 15, // JS times in milliseconds, so expire in 15m
					json: response,
				})
			)
		} catch {
			console.error('Unable to cache data')
		}
	},

	/**
	 * Returns the days of the week for dropdowns in whichever language - Monday first
	 */
	dayOfWeekOptions() {
		let dayOptions = []
		for (var i = 1; i <= 7; i++)
			dayOptions.push({
				id: dayjs().isoWeekday(i).format('dddd'),
				name: dayjs().isoWeekday(i).format('dddd'),
			})
		return dayOptions
	},

	/**
	 * Detect the URL scheme we should be using
	 * @returns {String}
	 */
	detectURLScheme() {
		let scheme = ''
		if (!['http', 'https'].includes(CS.url.split('://')[0])) {
			scheme = ['charitysuite', 'churchsuite'].includes(CS.url.split('.').pop())
				? 'http://'
				: 'https://'
		}

		return scheme
	},

	/**
	 * Fetches JSON data from local cache (expiry 1h) or from ChurchSuite JSON feed.
	 * Type is 'calendar', 'network' or 'smallgroups'.
	 */
	async fetchJSON(type, options = {}) {
		let data, url, uuid

		// detect URL scheme if not provided
		let scheme = this.detectURLScheme()

		if (!options.hasOwnProperty('configuration')) {
			console.error('WARNING: v4 of the ChurchSuite JSON script must be used with an embed configuration UUID. Please use v3 if using options to filter your data.')
			throw {
				message: 'v4 of ChurchSuite JSON script must be used with a configuration UUID.',
				type: 'format'
			}
		}

		uuid = options.configuration
		delete options.configuration
		url = scheme + CS.url + '/-/' + type + '/' + uuid + '/json' + CS.buildOptions(options)

		// if the page has a preview=1 query, don't use cached data so changes are live updated
		let preview = new URLSearchParams(location.search).get('preview') == 1
		let storedData = this.supportsLocalStorage() && !preview ? localStorage.getItem(url) : null

		if (storedData != null && JSON.parse(storedData).expires > new Date().getTime()) {
			data = JSON.parse(storedData).json
		} else {
			await fetch(url, {
					method: "GET",
					headers: {
						"X-ChurchSuite-JSON": window.location.href,
						"X-ChurchSuite-Version": scriptVersion
					}
				})
				.then(response => response.json())
				.then(response => {
					// if there is an error then throw it - this is caught in base.js
					if (response.hasOwnProperty('error')) throw response.error
					// otherwise attempt to store the response
					if (this.supportsLocalStorage() && !preview) {
						this.cacheJSONData(response, url)
					}
					data = response
				})
		}

		return data
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
	},
}
