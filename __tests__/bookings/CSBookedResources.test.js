require('../../src/cs')

window.CS.url = 'https://demo.churchsuite.com'

import CSBookedResources from '../../src/bookings/CSBookedResources'
import BookedResource from '../../src/bookings/booked-resource'
import Configuration from '../../src/bookings/configuration'
import Resource from '../../src/bookings/resource'

let BookedResources = new CSBookedResources()

// load an example booked resource in, and convert it to JSON
const bookedResourceJSON = require('./booked-resource.json')
const configurationJSON = require('./configuration.json')

describe('non-empty value initialised properties', () => {
	test('filter keys', () => {
		expect(BookedResources.filterKeys).toEqual(['resource'])
	})

	test('options keys', () => {
		expect(BookedResources.options).toEqual({})
	})

	test('resource module', () => {
		expect(BookedResources.resourceModule).toEqual('bookings')
	})
})

describe('empty array initialised properties', () => {
	let keys = ['bookedResources', 'resources']
	keys.forEach(function (key) {
		test(key + ' property', () => {
			expect(BookedResources[key]).toEqual([])
		})
	})
})

describe('null-initialised properties', () => {
	let keys = ['resource']
	keys.forEach(function (key) {
		test(key + ' property', () => {
			expect(BookedResources[key]).toBe(null)
		})
	})
})

describe('filteredResources() method', () => {
	let resource1 = new Resource({
		id: 1,
		name: 'Resource 1',
	})
	let resource2 = new Resource({
		id: 2,
		name: 'Resource 2',
	})

	beforeAll(() => {
		BookedResources.resources = [
			resource1,
			resource2,
		];
	})

	afterAll(() => {
		BookedResources = new CSBookedResources()
	})

	// no filter gives all results
	test('no filter', () => {
		BookedResources.resource = null
		expect(BookedResources.filteredResources()).toEqual([
			resource1,
			resource2,
		])
	})

	// id filter gives matching results
	test('id filter 1', () => {
		BookedResources.resource = '1'
		expect(BookedResources.filteredResources()).toEqual([
			resource1,
		])
	})

	// unknown id filter gives empty results
	test('id filter 4', () => {
		BookedResources.resource = '4'
		expect(BookedResources.filteredResources()).toEqual([])
	})
})

describe('buildConfiguration() method', () => {
	let bookedResource

	beforeAll(() => {
		bookedResource = BookedResources.buildConfiguration(configurationJSON)
	})

	afterAll(() => {
		BookedResources = new CSBookedResources()
	})

	// the model contents are tested separately
	test('returns a Configuration object', () => {
		expect(bookedResource).toBeInstanceOf(Configuration)
	})
})

describe('buildModelObject() method', () => {
	let bookedResource

	beforeAll(() => {
		bookedResource = BookedResources.buildModelObject(bookedResourceJSON)
	})

	afterAll(() => {
		BookedResources = new CSBookedResources()
	})

	// the model contents are tested separately
	test('returns an BookedResource object', () => {
		expect(bookedResource).toBeInstanceOf(BookedResource)
	})
})

describe('filterModel method', () => {
	beforeAll(() => {
		BookedResources = new CSBookedResources()

		// mock the other methods so we're just testing filterModel()
		BookedResources.filterModel_Resource = jest.fn().mockReturnValueOnce(true).mockReturnValueOnce(false)
	})

	test('filterModel with all true', () => {
		expect(BookedResources.filterModel()).toEqual(true)
	})

	test('filterModel with one false', () => {
		expect(BookedResources.filterModel()).toEqual(false)
	})
})

describe('filterModel_Resource method', () => {
	beforeAll(() => {
		BookedResources = new CSBookedResources()
	})

	test('null value', () => {
		BookedResources.resource = null
		expect(BookedResources.filterModel_Resource({})).toEqual(true)
	})

	test('match on id', () => {
		BookedResources.resource = '34'
		expect(
			BookedResources.filterModel_Resource({ resourceId: 34 })
		).toEqual(true)
	})

	test('no match on id', () => {
		BookedResources.resource = '34'
		expect(
			BookedResources.filterModel_Resource({
				resourceId: 12,
			})
		).toEqual(false)
	})
})

describe('postInit() method', () => {
	let bookedResource

	const resourceJson = {
		"resources": [
			{
				id: 12,
				name: 'Resource Name',
				quantity: 12,
				description: 'Some sort of description',
				all_sites: false,
				site_ids: [
					1,
					4
				]
			},
			{
				id: 14,
				name: 'Resource Name 2',
				quantity: 12,
				description: 'Some sort of description',
				all_sites: false,
				site_ids: [
					1,
					4
				]
			}
		]
	}

	beforeAll(() => {
		BookedResources.postInit(resourceJson)
	})

	afterAll(() => {
		BookedResources = new CSBookedResources()
	})

	// the model contents are tested separately
	test('sets up an array of Resource objects', () => {
		BookedResources.resources.forEach(resource => {
			expect(resource).toBeInstanceOf(Resource)
		})
	})
})