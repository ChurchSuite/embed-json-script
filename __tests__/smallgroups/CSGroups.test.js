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
		expect(Groups.options).toEqual({ show_tags: 1 })	})

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

describe('filterModel method', () => {
	beforeAll(() => {
		Groups = new CSGroups()

		// mock the other methods so we're just testing filterModel()
		Groups.filterModel_Cluster = jest.fn().mockReturnValueOnce(true).mockReturnValueOnce(false)
		Groups.filterModel_Day = jest.fn().mockReturnValueOnce(true).mockReturnValueOnce(true)
		Groups.filterModel_Label = jest.fn().mockReturnValueOnce(true).mockReturnValueOnce(true)
		Groups.filterModel_Search = jest.fn().mockReturnValueOnce(true).mockReturnValueOnce(true)
		Groups.filterModel_Site = jest.fn().mockReturnValueOnce(true).mockReturnValueOnce(true)
		Groups.filterModel_Tag = jest.fn().mockReturnValueOnce(true).mockReturnValueOnce(true)
	})

	test('filterModel with all true', () => {
		expect(Groups.filterModel()).toEqual(true)
	})

	test('filterModel with one false', () => {
		expect(Groups.filterModel()).toEqual(false)
	})
})

describe('filterModel_Cluster method', () => {
	beforeAll(() => {
		Groups = new CSGroups()
	})

	// if not filtering by cluster, return all groups
	test('not filtering', () => {
		Groups.cluster = null
		expect(Groups.filterModel_Cluster({})).toEqual(true)
	})

	// if filtering by cluster and group has no cluster, don't show
	test('filtering - null value', () => {
		Groups.cluster = 'Tuesday'
		expect(Groups.filterModel_Cluster({})).toEqual(false)
	})

	test('match on id', () => {
		Groups.cluster = 'test'
		expect(
			Groups.filterModel_Cluster({ cluster: 'wwwww', _original: { cluster: { id: 'test', name: 'wwwww' } } })
		).toEqual(true)
	})

	test('no match on id', () => {
		Groups.cluster = 'test'
		expect(
			Groups.filterModel_Cluster({
				cluster: 'wwwww',
				_original: { cluster: { id: 'badger', name: 'wwwww' } },
			})
		).toEqual(false)
	})

	test('match on name', () => {
		Groups.cluster = 'test'
		expect(
			Groups.filterModel_Cluster({ cluster: 'test', _original: { cluster: { id: 'wwww', name: 'test' } } })
		).toEqual(true)
	})

	test('no match on named', () => {
		Groups.cluster = 'test'
		expect(
			Groups.filterModel_Cluster({ cluster: 'pppp', _original: { cluster: { id: 'wwww', name: 'pppp' } } })
		).toEqual(false)
	})
})

describe('mapConfiguration() method', () => {
	test('without configuration', () => {
		Groups.mapConfiguration();
		expect(Groups.options).toEqual({ show_tags: 1 })
	})

	test('with configuration', () => {
		Groups.configuration = {
			id: 1,
			showFilterLabels: 1,
			showFilterSites: 1
		}
		Groups.mapConfiguration();
		expect(Groups.options).toEqual({ show_tags: 1, show_labels: 1, show_sites: 1 })
	})
})

describe('filterModel_Day() method', () => {
	afterAll(() => {
		Groups = new CSGroups()
	})

	test('no day filter', () => {
		expect(Groups.filterModel_Day({day: 1})).toEqual(true)
	})

	test('model with no day', () => {
		Groups.day = 'Friday'
		expect(Groups.filterModel_Day({})).toEqual(true)
	})

	test('model matched on day string', () => {
		Groups.day = 'Friday'
		expect(Groups.filterModel_Day({day: dayjs('2022-07-01')})).toEqual(true)
	})

	test('model matched on day int', () => {
		Groups.day = 4
		let model = {
			day: dayjs('2022-07-02'), // friday
			_original: {
				day: 4
			}
		}
		expect(Groups.filterModel_Day(model)).toEqual(true)
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

	test('null value', () => {
		Groups.site = null
		expect(Groups.filterModel_Site({})).toEqual(true)
	})

	test('match on id', () => {
		Groups.site = 'test'
		expect(
			Groups.filterModel_Site({ _original: { site: { id: 'test', name: 'wwwww' } } })
		).toEqual(true)
	})

	test('no match on id', () => {
		Groups.site = 'test'
		expect(
			Groups.filterModel_Site({
				_original: { site: { id: 'badger', name: 'wwwww' } },
			})
		).toEqual(false)
	})

	test('match on name', () => {
		Groups.site = 'test'
		expect(
			Groups.filterModel_Site({ _original: { site: { id: 'wwww', name: 'test' } } })
		).toEqual(true)
	})

	test('no match on named', () => {
		Groups.site = 'test'
		expect(
			Groups.filterModel_Site({ _original: { site: { id: 'wwww', name: 'pppp' } } })
		).toEqual(false)
	})
})