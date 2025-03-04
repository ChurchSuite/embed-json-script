require('../../src/cs')

window.CS.url = 'https://demo.churchsuite.com'

import CSGroups from '../../src/smallgroups/CSGroups'
import Group from '../../src/smallgroups/group'

let Groups = new CSGroups()

// load an example event in, and convert it to JSON
const groupJSON = require('./group.json')

describe('non-empty value initialised properties', () => {
	test('filter keys', () => {
		expect(Groups.filterKeys).toEqual(['label', 'day', 'search', 'site'])
	})

	test('options keys', () => {
		expect(Groups.options).toEqual({})
	})

	test('resource module', () => {
		expect(Groups.resourceModule).toEqual('smallgroups')
	})
})

describe('empty array initialised properties', () => {
	let keys = ['groups', 'labels', 'site', 'sites']
	keys.forEach(function (key) {
		test(key + ' property', () => {
			expect(Groups[key]).toEqual([])
		})
	})
})

describe('null-initialised properties', () => {
	let keys = ['day', 'search', 'searchQuery']
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
})

describe('filterModel method', () => {
	beforeAll(() => {
		Groups = new CSGroups()

		// mock the other methods so we're just testing filterModel()
		Groups.filterModel_Day = jest.fn().mockReturnValueOnce(true).mockReturnValueOnce(true)
		Groups.filterModel_Label = jest.fn().mockReturnValueOnce(true).mockReturnValueOnce(false)
		Groups.filterModel_Search = jest.fn().mockReturnValueOnce(true).mockReturnValueOnce(true)
		Groups.filterModel_Site = jest.fn().mockReturnValueOnce(true).mockReturnValueOnce(true)
	})

	test('filterModel with all true', () => {
		expect(Groups.filterModel()).toEqual(true)
	})

	test('filterModel with one false', () => {
		expect(Groups.filterModel()).toEqual(false)
	})
})

describe('filterModel_Day() method', () => {
	beforeAll(() => {
		Groups = new CSGroups()
	})

	test('no day filter', () => {
		expect(Groups.filterModel_Day({day: 'Wednesday'})).toEqual(true)
	})

	test('model with no day', () => {
		Groups.day = ['Friday']
		expect(Groups.filterModel_Day({day: null})).toEqual(true)
	})

	test('model matched on day string', () => {
		Groups.day = ['Friday']
		expect(Groups.filterModel_Day({day: 'Friday'})).toEqual(true)
	})

	test('model matched on day string mismatched case', () => {
		Groups.day = ['friday']
		expect(Groups.filterModel_Day({day: 'Friday'})).toEqual(true)
	})
})

describe('filterModel_Search() method', () => {
	test('no search query', () => {
		expect(Groups.filterModel_Search({})).toEqual(true)
	})

	let model = {
		category: 'Interstellar Groups',
		day: dayjs('2022-07-01'), // friday
		location: 'Space',
		name: 'Beeston'
	}

	test('no match', () => {
		Groups.searchQuery = 'banana'
		expect(Groups.filterModel_Search(model)).toEqual(false)
	})

	test('match on category', () => {
		Groups.searchQuery = 'interstellar'
		expect(Groups.filterModel_Search(model)).toEqual(true)
	})

	test('match on day', () => {
		Groups.searchQuery = 'friday'
		expect(Groups.filterModel_Search(model)).toEqual(true)
	})

	test('match on location', () => {
		Groups.searchQuery = 'space'
		expect(Groups.filterModel_Search(model)).toEqual(true)
	})

	test('match on name', () => {
		Groups.searchQuery = 'beeston'
		expect(Groups.filterModel_Search(model)).toEqual(true)
	})
})

describe('filterModel_Site method', () => {
	beforeAll(() => {
		Groups = new CSGroups()
	})

	test('all sites, no search term', () => {
		Groups.site = []
		const group = new Group({...groupJSON, all_sites: true, site_ids: [1]})
		expect(Groups.filterModel_Site(group)).toEqual(true)
	})

	test('all sites', () => {
		Groups.site = ['1']
		const group = new Group({...groupJSON, all_sites: true, site_ids: [1]})
		expect(Groups.filterModel_Site(group)).toEqual(true)
	})

	test('site should match', () => {
		Groups.site = ['2']
		const group = new Group({...groupJSON, all_sites: false, site_ids: [2, 4]})
		expect(Groups.filterModel_Site(group)).toEqual(true)
	})

	test('site shouldn\'t match', () => {
		Groups.site = ['5']
		const group = new Group({...groupJSON, all_sites: false, site_ids: [2, 4]})
		expect(Groups.filterModel_Site(group)).toEqual(false)
	})
})

/**
 * Label filtering should be an OR check rather than AND - if two labels are
 * selected, any organisation that is one OR the other should be returned.
 */
test('label filtering', () => {
	let CSG = new CSGroups;
	let model = {
		labels: [
			{
				id: 1, // label id 1
				options: ['a'], // label options
			},
			{
				id: 2,
				options: ['b', 'c'],
			},
		]
	}

	CSG.label = {
		'2': null
	}

	// we've selected no labels, so model should be included
	expect(CSG.filterModel_Label(model)).toBe(true);

	// option C has been selected for label 2
	CSG.label = {
		'2': ['c']
	}

	// the model has label 2 with a value of c, should be fine
	expect(CSG.filterModel_Label(model)).toBe(true);

	// now we've selected a second filter that matches - should still be fine though
	CSG.label = {
		'1': ['a'],
		'2': ['c'],
	}

	expect(CSG.filterModel_Label(model)).toBe(true);

	// we've selected two filters - we match one but not the other, so we shouldn't be included
	CSG.label = {
		'1': ['a'],
		'3': ['d'], // this is another label that the model doesn't match
	}

	expect(CSG.filterModel_Label(model)).toBe(false);

	// finally, we've only selected one this model doesn't have
	CSG.label = {
		'3': ['d'],
	}

	expect(CSG.filterModel_Label(model)).toBe(false);
});