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
		expect(Events.mergeIdentifiers).toEqual([event._original.merge_identifier])
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
		Events.category = ['test']
		expect(
			Events.filterModel_Category({ categoryId: 'test' })
		).toEqual(true)
	})

	test('no match on id', () => {
		Events.category = 'test'
		expect(
			Events.filterModel_Category({ categoryId: 'badger' })
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
		Events.site = ['test']
		expect(
			Events.filterModel_Site({siteId: 'test'})
		).toEqual(true)
	})

	test('no match on id', () => {
		Events.site = ['test']
		expect(
			Events.filterModel_Site({siteId: 'badger'})
		).toEqual(false)
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
