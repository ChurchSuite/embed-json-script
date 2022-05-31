var dayjs = require('dayjs')

// require isoweek to create dayjs objects for days
var isoWeek = require('dayjs/plugin/isoWeek')
dayjs.extend(isoWeek)

// require internationalisation packs
var localizedFormat = require('dayjs/plugin/localizedFormat')
dayjs.extend(localizedFormat)
require('dayjs/locale/de')

window.dayjs = dayjs

window.CS = { url: 'https://demo.churchsuite.com' }

import Base from '../src/base'

let CSBase = new Base()

describe('empty object initialised properties', () => {
	let keys = ['configuration', 'options']
	keys.forEach(function (key) {
		test('resource module', () => {
			expect(CSBase[key]).toEqual({})
		})
	})
})

describe('empty array initialised properties', () => {
	let keys = ['filterKeys', 'models', 'modelsAll']
	keys.forEach(function (key) {
		test('resource module', () => {
			expect(CSBase[key]).toEqual([])
		})
	})
})

test('loading property', () => {
	expect(CSBase.loading).toEqual(true)
})

test('resourceModule property', () => {
	expect(CSBase.resourceModule).toEqual('')
})

describe('buildIdNameOption() method', () => {
	let result = null
	let exampleCategory = {
		id: 5,
		name: 'Kids',
		color: '#0e7b35',
	}

	beforeAll(() => {
		CSBase = new Base()
		CSBase.categories = []
		CSBase.categoryOptions = []
		// run the method
		result = CSBase.buildIdNameOption('category', exampleCategory, 'categories')
	})

	test('legacy categories array - no existing data', () => {
		expect(CSBase.categories).toEqual(['Kids'])
	})

	test('categoryOptions array - no existing data', () => {
		expect(CSBase.categoryOptions).toEqual([{ id: 5, name: 'Kids' }])
	})

	test('categories and categoryOptions arrays - existing data', () => {
		CSBase = new Base()

		// set categories and categoryOptions so we can check new key added
		CSBase.categories = ['Bananas']
		CSBase.categoryOptions = [{ id: 43, name: 'Bananas' }]

		CSBase.buildIdNameOption('category', exampleCategory, 'categories')

		expect(CSBase.categories).toEqual(['Bananas', 'Kids'])
		expect(CSBase.categoryOptions).toEqual([
			{ id: 43, name: 'Bananas' },
			{ id: 5, name: 'Kids' },
		])
	})

	test('categoryOptions arrays - duplicate ids', () => {
		CSBase = new Base()

		// set categories and categoryOptions so we can check new key added
		CSBase.categories = []
		CSBase.categoryOptions = []

		// run it twice with the same id - should only add it once
		CSBase.buildIdNameOption('category', exampleCategory, 'categories')
		CSBase.buildIdNameOption('category', exampleCategory, 'categories')

		expect(CSBase.categories).toEqual(['Kids'])
		expect(CSBase.categoryOptions).toEqual([{ id: 5, name: 'Kids' }])
	})

	test('site - non-custom legacy key', () => {
		CSBase = new Base()
		CSBase.sites = []
		CSBase.siteOptions = []

		let exampleSite = {
			id: 47,
			name: 'Test Site',
		}

		CSBase.buildIdNameOption('site', exampleSite)

		expect(CSBase.sites).toEqual(['Test Site'])
		expect(CSBase.siteOptions).toEqual([{ id: 47, name: 'Test Site' }])
	})

	test('null property', () => {
		CSBase = new Base()
		CSBase.sites = []
		CSBase.siteOptions = []

		let result = CSBase.buildIdNameOption('site', null)

		expect(result).toEqual(undefined)
		expect(CSBase.sites).toEqual([])
		expect(CSBase.siteOptions).toEqual([])
	})
})

test('buildModelObject method', () => {
	expect(CSBase.buildModelObject({ test: 'fish' })).toEqual({ test: 'fish' })
})

test('filterModel method', () => {
	expect(CSBase.filterModel({})).toEqual(true)
})

test('filterModelsEnabled method', () => {
	expect(CSBase.filterModelsEnabled()).toEqual(true)
})

describe('filterModels() method', () => {
	beforeEach(() => {
		CSBase = new Base()

		// mock the magic dispatch method
		CSBase.$dispatch = jest.fn()
	})

	test('dispatch models-updated', () => {
		CSBase.filterModels()
		expect(CSBase.$dispatch).toBeCalledWith('models-updated')
	})

	test('filterModelsEnabled is false', () => {
		CSBase.filterModelsEnabled = function () {
			return false
		}
		CSBase.modelsAll = ['dog', 'fish']
		CSBase.filterModels()

		// if filterModelsEnabled is false, models should never be populated
		expect(CSBase.models).toEqual([])
	})

	test('filterModelsEnabled is true', () => {
		let models = ['dog', 'fish']
		CSBase.modelsAll = models
		CSBase.filterModels()

		// if filterModelsEnabled is true, models will filter - on base, that means passthrough
		expect(CSBase.models).toEqual(models)
	})

	test('loading property', () => {
		CSBase.filterModels()
		expect(CSBase.loading).toEqual(false)
	})
})

describe('filterValue method', () => {
	beforeAll(() => {
		CSBase = new Base()
	})

	test('null value', () => {
		CSBase.test = null
		expect(CSBase.filterValue('test')).toEqual(null)
	})

	test('array value - some left', () => {
		CSBase.test = ['sandwich', '', 0, 'pickle', '0', null, 21]
		expect(CSBase.filterValue('test')).toEqual(['sandwich', 'pickle', '21'])
	})

	test('array value - none left', () => {
		CSBase.test = ['', 0, '0', null]
		expect(CSBase.filterValue('test')).toEqual(null)
		expect(CSBase.test).toEqual(null)
	})

	test('string value - given', () => {
		CSBase.test = 'artichoke'
		expect(CSBase.filterValue('test')).toEqual(['artichoke'])
	})

	test('string value - 0', () => {
		CSBase.test = 0
		expect(CSBase.filterValue('test')).toEqual(null)
	})

	test("string value - '0'", () => {
		CSBase.test = 0
		expect(CSBase.filterValue('test')).toEqual(null)
	})

	test('string value - instanceof String', () => {
		CSBase.test = new String('banana')
		expect(CSBase.filterValue('test')).toEqual(['banana'])
	})

	test('string value - empty', () => {
		CSBase.test = ''
		expect(CSBase.filterValue('test')).toEqual(null)
		expect(CSBase.test).toEqual(null)
	})

	test('pass in parent object', () => {
		CSBase = new Base()
		let parent = { test2: 'Aha!' }
		expect(CSBase.filterValue('test2', parent)).toEqual(['Aha!'])
	})
})

describe('init method', () => {
	beforeAll(async () => {
		CSBase = new Base()
		CSBase.filterKeys = ['sites']
		CSBase.resourceModule = 'churches'
		CSBase.options = { test: 'badger' }

		// mock the magic methods
		CSBase.$watch = jest.fn()
		CSBase.$nextTick = jest.fn()

		// mock postInit Method
		CSBase.postInit = jest.fn()

		// mock the fetchJSON method
		window.CS.fetchJSON = jest.fn().mockResolvedValue([])

		window.CS.locale = 'de'

		await CSBase.init()
	})

	test('dayjs locale', () => {
		expect(dayjs.locale()).toEqual('de')
	})

	test('$watch', () => {
		expect(CSBase.$watch).toBeCalledWith(['sites'], expect.any(Function))
	})

	test('fetchJSON', () => {
		expect(window.CS.fetchJSON).toBeCalledWith(CSBase.resourceModule, CSBase.options)
	})

	test('postInit', () => {
		expect(CSBase.postInit).toBeCalledWith()
	})

	test('configuration key', async () => {
		window.CS.fetchJSON = jest.fn().mockResolvedValue({ configuration: 'yes', data: ['test'] })
		await CSBase.init()

		expect(CSBase.configuration).toEqual('yes')
		expect(CSBase.modelsAll).toEqual(['test'])
	})

	test('no configuration key', async () => {
		CSBase.modelsAll = []
		window.CS.fetchJSON = jest.fn().mockResolvedValue(['test2'])
		await CSBase.init()

		expect(CSBase.modelsAll).toEqual(['test2'])
	})
})

test('mapConfiguration function', () => {
	expect(CSBase.mapConfiguration()).toEqual(undefined)
})

test('postInit function', () => {
	expect(CSBase.postInit()).toEqual(undefined)
})
