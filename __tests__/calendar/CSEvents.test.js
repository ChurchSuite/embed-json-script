require('../../src/cs')

window.CS.url = 'https://demo.churchsuite.com'

import CSEvents from '../../src/calendar/CSEvents'
import Event from '../../src/calendar/event'

let Events = new CSEvents()

// load an example event in, and convert it to JSON
const eventJSON = require('./event.json')

describe('non-empty value initialised properties', () => {
	test('filter keys', () => {
		expect(Events.filterKeys).toEqual(['category', 'search', 'site'])
	})

	test('options keys', () => {
		expect(Events.options).toEqual({})
	})

	test('resource module', () => {
		expect(Events.resourceModule).toEqual('calendar')
	})
})

describe('empty array initialised properties', () => {
	let keys = ['categories', 'category', 'events', 'mergeIdentifiers', 'modelsMerged', 'site', 'sites']
	keys.forEach(function (key) {
		test(key + ' property', () => {
			expect(Events[key]).toEqual([])
		})
	})
})

describe('null-initialised properties', () => {
	let keys = ['search', 'searchQuery']
	keys.forEach(function (key) {
		test(key + ' property', () => {
			expect(Events[key]).toBe(null)
		})
	})
})

describe('buildModelObject() method', () => {
	let event, event2

	beforeAll(() => {
		event = Events.buildModelObject({
			...eventJSON,
			merge_identifier: 'sameMergeIdentifier'
		})
		event2 = Events.buildModelObject({
			...eventJSON,
			merge_identifier: 'sameMergeIdentifier'
		})
	})

	afterAll(() => {
		Events = new CSEvents()
	})

	// the model contents are tested separately
	test('returns an Event object for both events', () => {
		expect(event).toBeInstanceOf(Event)
		expect(event2).toBeInstanceOf(Event)
	})

	test('modelsMerged property returns only the first event', () => {
		expect(Events.modelsMerged).toEqual([event])
	})

	test('mergeIdentifiers property returns only the first event identifier', () => {
		expect(Events.mergeIdentifiers).toEqual([event.mergeIdentifier])
	})
})

describe('filterModelsEnabled method', () => {
	beforeEach(() => {
		Events = new CSEvents()
	})

	afterAll(() => {
		Events = new CSEvents()
	})

	// the model contents are tested separately
	test('no search queries', () => {
		expect(Events.filterModelsEnabled()).toEqual(false)
	})

	test('search property', () => {
		Events.search = 'test'
		expect(Events.filterModelsEnabled()).toEqual(true)
	})

	test('category property', () => {
		Events.category = 'test'
		expect(Events.filterModelsEnabled()).toEqual(true)
	})

	test('site property', () => {
		Events.site = 'test'
		expect(Events.filterModelsEnabled()).toEqual(true)
	})
})

describe('filterModel method', () => {
	beforeAll(() => {
		Events = new CSEvents()

		// mock the other methods so we're just testing filterModel()
		Events.filterModel_Category = jest.fn().mockReturnValueOnce(true).mockReturnValueOnce(false)
		Events.filterModel_Search = jest.fn().mockReturnValueOnce(true).mockReturnValueOnce(true)
		Events.filterModel_Site = jest.fn().mockReturnValueOnce(true).mockReturnValueOnce(true)
	})

	test('filterModel with all true', () => {
		expect(Events.filterModel()).toEqual(true)
	})

	test('filterModel with one false', () => {
		expect(Events.filterModel()).toEqual(false)
	})
})

describe('filterModel_Category method', () => {
	beforeAll(() => {
		Events = new CSEvents()
	})

	test('null value', () => {
		Events.category = null
		expect(Events.filterModel_Category({})).toEqual(true)
	})

	test('match on id', () => {
		// test an array, like a multiselect - value could be integer or string
		Events.category = ['12', 14]
		expect(
			Events.filterModel_Category({ categoryId: 12 })
		).toEqual(true)
		expect(
			Events.filterModel_Category({ categoryId: 14 })
		).toEqual(true)
		expect(
			Events.filterModel_Category({ categoryId: 15 })
		).toEqual(false)

		// test a single select value - always a string
		Events.category = '12'
		expect(
			Events.filterModel_Category({ categoryId: 12 })
		).toEqual(true)
		expect(
			Events.filterModel_Category({ categoryId: 15 })
		).toEqual(false)

		// test an integer too just to be safe, in case filled by JS
		Events.category = 12
		expect(
			Events.filterModel_Category({ categoryId: 12 })
		).toEqual(true)
		expect(
			Events.filterModel_Category({ categoryId: 15 })
		).toEqual(false)
	})

	test('no match on id', () => {
		// test a single select value - always a string, but test an integer too
		Events.category = '12'
		expect(
			Events.filterModel_Category({ categoryId: 15 })
		).toEqual(false)
		Events.category = 12
		expect(
			Events.filterModel_Category({ categoryId: 15 })
		).toEqual(false)
	})
})

describe('filterModel_Site method', () => {
	beforeAll(() => {
		Events = new CSEvents()
	})

	test('null value', () => {
		Events.site = []
		expect(Events.filterModel_Site({})).toEqual(true)
	})

	test('match on id', () => {
		Events.site	= ['35']
		expect(
			Events.filterModel_Site({siteIds: [35]})
		).toEqual(true)
		Events.site	= [35]
		expect(
			Events.filterModel_Site({siteIds: [35]})
		).toEqual(true)
	})

	test('match all sites event', () => {
		Events.site = ['35', '57']
		expect(
			Events.filterModel_Site({allSites: true, siteIds: []})
		).toEqual(true)
	})

	test('no match on ids', () => {
		Events.site = ['12']
		expect(
			Events.filterModel_Site({siteIds: [3, 8]})
		).toEqual(false)
		Events.site = [12]
		expect(
			Events.filterModel_Site({siteIds: [3, 8]})
		).toEqual(false)
	})

	test('partial match on ids', () => {
		Events.site = ['20', '45']
		expect(
			Events.filterModel_Site({siteIds: [45,80]})
		).toEqual(true)
		Events.site = [20, 45]
		expect(
			Events.filterModel_Site({siteIds: [45,80]})
		).toEqual(true)
	})
})

describe('filterModel_Search method', () => {
	beforeAll(() => {
		Events = new CSEvents()
	})

	test('no searchQuery value', () => {
		Events.searchQuery = null
		expect(Events.filterModel_Search({})).toEqual(true)

		// reset searchQuery for following tests
		Events.searchQuery = 'test'
	})

	test('search by name', () => {
		let model = {
			category: '',
			location: '',
			name: 'test',
			start: dayjs('2022-01-01T00:00:00.000Z'),
		}
		expect(Events.filterModel_Search(model)).toEqual(true)
	})

	test('search by name no match', () => {
		let model = {
			category: '',
			location: '',
			name: 'ba',
			start: dayjs('2022-01-01T00:00:00.000Z'),
		}
		expect(Events.filterModel_Search(model)).toEqual(false)
	})

	test('search by category', () => {
		let model = {
			category: 'test',
			location: '',
			name: '',
			start: dayjs('2022-01-01T00:00:00.000Z'),
		}
		expect(Events.filterModel_Search(model)).toEqual(true)
	})

	test('search by category no match', () => {
		let model = {
			category: 'www',
			location: '',
			name: '',
			start: dayjs('2022-01-01T00:00:00.000Z'),
		}
		expect(Events.filterModel_Search(model)).toEqual(false)
	})

	test('search by location', () => {
		let model = {
			category: '',
			location: 'test',
			name: '',
			start: dayjs('2022-01-01T00:00:00.000Z'),
		}
		expect(Events.filterModel_Search(model)).toEqual(true)
	})

	test('search by location no match', () => {
		let model = {
			category: '',
			location: 'qqq',
			name: '',
			start: dayjs('2022-01-01T00:00:00.000Z'),
		}
		expect(Events.filterModel_Search(model)).toEqual(false)
	})

	test('search by start', () => {
		let model = {
			category: '',
			location: '',
			name: '',
			start: dayjs('2022-01-01T00:00:00.000Z'),
		}
		Events.searchQuery = '01 jan 2022'
		expect(Events.filterModel_Search(model)).toEqual(true)
	})

	test('search by start no match', () => {
		let model = {
			category: '',
			location: 'qqq',
			name: '',
			start: dayjs('2022-01-01T00:00:00.000Z'),
		}
		Events.searchQuery = '05 jan 2022'
		expect(Events.filterModel_Search(model)).toEqual(false)
	})
})

describe('test Configuration count being respected', () => {
	beforeAll(() => {
		Events = new CSEvents()
		Events.$dispatch = jest.fn()
		Events.configuration.numOfEvents = 2
		Events.modelsAll = [
			{
				name: 'Ev A1',
				categoryId: 2,
				mergeIdentifier: 'A'
			},
			{
				name: 'Ev A2',
				categoryId: 2,
				mergeIdentifier: 'A'
			},
			{
				name: 'Ev A3',
				categoryId: 2,
				mergeIdentifier: 'A'
			},
			{
				name: 'Ev A4',
				categoryId: 2,
				mergeIdentifier: 'A'
			},
			{
				name: 'Ev B3',
				categoryId: 3,
				mergeIdentifier: 'B'
			},
			{
				name: 'Ev B4',
				categoryId: 4,
				mergeIdentifier: 'B'
			},
			{
				name: 'Ev C1',
				categoryId: 5,
				mergeIdentifier: 'C'
			}
		]
		Events.modelsMerged = [
			{
				name: 'Ev A1',
				categoryId: 2,
				mergeIdentifier: 'A'
			},
			{
				name: 'Ev B3',
				categoryId: 3,
				mergeIdentifier: 'B'
			},
			{
				name: 'Ev C1',
				categoryId: 5,
				mergeIdentifier: 'C'
			}
		]
	})

	/**
	 * When we're not filtering, the Configuration is set to 2 events, so we
	 * should see one from each merged group.
	 */
	test('with no filters, only 2 events shown', () => {
		Events.filterModels()
		expect(Events.models).toEqual([
			{
				name: 'Ev A1',
				categoryId: 2,
				mergeIdentifier: 'A'
			},
			{
				name: 'Ev B3',
				categoryId: 3,
				mergeIdentifier: 'B'
			}
		])
	})

	/**
	 * When a filter is applied, unmerge the events so we show more than the
	 * Embed Configuration is set to.
	 */
	test('with category filter, all events shown', () => {
		Events.category = ['2']
		Events.filterModels()
		expect(Events.models).toEqual([
			{
				name: 'Ev A1',
				categoryId: 2,
				mergeIdentifier: 'A'
			},
			{
				name: 'Ev A2',
				categoryId: 2,
				mergeIdentifier: 'A'
			},
			{
				name: 'Ev A3',
				categoryId: 2,
				mergeIdentifier: 'A'
			},
			{
				name: 'Ev A4',
				categoryId: 2,
				mergeIdentifier: 'A'
			}
		])
	})

	/**
	 * When we're not filtering, the Configuration is set to 2 events, so we
	 * should see one from each merged group.
	 */
	test('with no filters, and no limits, all events shown', () => {
		Events.category = null
		Events.configuration.numOfEvents = null
		Events.filterModels()
		expect(Events.models).toEqual([
			{
				name: 'Ev A1',
				categoryId: 2,
				mergeIdentifier: 'A'
			},
			{
				name: 'Ev B3',
				categoryId: 3,
				mergeIdentifier: 'B'
			},
			{
				name: 'Ev C1',
				categoryId: 5,
				mergeIdentifier: 'C'
			}
		])
	})

})