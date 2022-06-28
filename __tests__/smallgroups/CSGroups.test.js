require('../../src/cs')

window.CS.url = 'https://demo.churchsuite.com'

import CSGroups from '../../src/smallgroups/CSGroups'
import Group from '../../src/smallgroups/group'

let Groups = new CSGroups()

// load an example event in, and convert it to JSON
const groupJSON = require('./group.json')

describe('non-empty value initialised properties', () => {
	test('filter keys', () => {
		expect(Groups.filterKeys).toEqual(['day', 'tag', 'search', 'site', 'label', 'cluster'])
	})

	test('options keys', () => {
		expect(Groups.options).toEqual({ show_tags: 1 })
	})

	test('resource module', () => {
		expect(Groups.resourceModule).toEqual('smallgroups')
	})

	test('dayOptions property', () => {
		expect(Groups.dayOptions).toEqual([
			{ id: 'Sunday', name: 'Sunday' },
			{ id: 'Monday', name: 'Monday' },
			{ id: 'Tuesday', name: 'Tuesday' },
			{ id: 'Wednesday', name: 'Wednesday' },
			{ id: 'Thursday', name: 'Thursday' },
			{ id: 'Friday', name: 'Friday' },
			{ id: 'Saturday', name: 'Saturday' },
		])
	})

	test('days property', () => {
		expect(Groups.days).toEqual([
			'Sunday',
			'Monday',
			'Tuesday',
			'Wednesday',
			'Thursday',
			'Friday',
			'Saturday',
		])
	})
	
})

describe('empty array initialised properties', () => {
	let keys = ['groups', 'clusterOptions', 'clusters', 'labels', 'siteOptions', 'sites', 'tagOptions', 'tags']
	keys.forEach(function (key) {
		test(key + ' property', () => {
			expect(Groups[key]).toEqual([])
		})
	})
})

describe('null-initialised properties', () => {
	let keys = ['cluster', 'day', 'search', 'searchQuery', 'site', 'tag']
	keys.forEach(function (key) {
		test(key + ' property', () => {
			expect(Groups[key]).toBe(null)
		})
	})
})

test('label property', () => {
	expect(Groups.label).toEqual({})
})

describe('buildModelObject() method', () => {
	let group

	beforeAll(() => {
		group = Groups.buildModelObject(groupJSON)
	})

	afterAll(() => {
		Groups = new CSGroups()
	})

	// the model contents are tested separately
	test('returns an Group object', () => {
		expect(group).toBeInstanceOf(Group)
	})

	describe('filter properties', () => {
		test('clusters', () => {
			expect(Groups.clusters).toEqual(['Online Gatherings'])
			expect(Groups.clusterOptions).toEqual([{ id: 12, name: 'Online Gatherings' }])
		})

		test('sites', () => {
			expect(Groups.sites).toEqual(['Leicester'])
			expect(Groups.siteOptions).toEqual([{ id: 20, name: 'Leicester' }])
		})

		test('tags', () => {
			expect(Groups.tags).toEqual(['Daytime groups', 'Study groups'])
			expect(Groups.tagOptions).toEqual([
				{ id: 18, name: 'Daytime groups' },
				{ id: 19, name: 'Study groups' }
			])
		})
	})

	
})