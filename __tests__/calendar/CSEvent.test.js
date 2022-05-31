var dayjs = require('dayjs')

// require isoweek to create dayjs objects for days
var isoWeek = require('dayjs/plugin/isoWeek')
dayjs.extend(isoWeek)
window.dayjs = dayjs

window.CS = { url: 'https://demo.churchsuite.com' }

import CSEvents from '../../src/calendar/CSEvents'

let Events = new CSEvents()

// load an example event in, and convert it to JSON
const eventJSON = require('./event.json')

describe('non-empty value initialised properties', () => {
	test('filter keys', () => {
		expect(Events.filterKeys).toEqual(['category', 'search', 'site'])
	})

	test('options keys', () => {
		expect(Events.options).toEqual({ includeMerged: true })
	})

	test('resource module', () => {
		expect(Events.resourceModule).toEqual('calendar')
	})
})

describe('empty array initialised properties', () => {
	let keys = ['categories', 'categoryOptions', 'events', 'modelsMerged', 'siteOptions', 'sites']
	keys.forEach(function (key) {
		test('resource module', () => {
			expect(Events[key]).toEqual([])
		})
	})
})

describe('null-initialised properties', () => {
	let keys = ['category', 'search', 'searchQuery', 'site']
	keys.forEach(function (key) {
		test('resource module', () => {
			expect(Events[key]).toBe(null)
		})
	})
})
