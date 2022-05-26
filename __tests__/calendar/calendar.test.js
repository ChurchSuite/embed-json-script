var dayjs = require('dayjs')

// require isoweek to create dayjs objects for days
var isoWeek = require('dayjs/plugin/isoWeek')
dayjs.extend(isoWeek)
window.dayjs = dayjs

window.CS = {url: 'https://demo.churchsuite.com'};

import CSEvents from '../../src/calendar/CSEvents'

let Events = new CSEvents();

// load an example event in, and convert it to JSON
const eventJSON = require('./event.json');


describe('non-empty value initialised properties', () => {
	test('filter keys', () => {
		expect(Events.filterKeys).toEqual(['category', 'search', 'site']);
	});

	test('options keys', () => {
		expect(Events.options).toEqual({ includeMerged: true });
	});

	test('resource module', () => {
		expect(Events.resourceModule).toEqual('calendar');
	});
});

describe('empty array initialised properties', () => {
	let keys = ['categoryOptions', 'modelsMerged', 'siteOptions', 'sites'];
	keys.forEach(function (key) {
		test('resource module', () => {
			expect(Events[key]).toEqual([]);
		});
	});
});

describe('null-initialised properties', () => {
	let keys = ['category', 'search', 'searchQuery', 'site'];
	keys.forEach(function (key) {
		test('resource module', () => {
			expect(Events[key]).toBe(null);
		});
	});
});

describe('buildIdNameOption() method', () => {
	let result = null;
	let exampleCategory = { 
		id: 5, 
		name: 'Kids', 
		color: '#0e7b35',
	};

	beforeAll(() => {
		Events = new CSEvents();
		// run the method
		result = Events.buildIdNameOption('category', exampleCategory, 'categories');
	});

	test('legacy categories array - no existing data', () => {
		expect(Events.categories).toEqual(['Kids']);
	});

	test('categoryOptions array - no existing data', () => {
		expect(Events.categoryOptions).toEqual([{ id: 5, name: 'Kids' }]);
	});

	test('categories and categoryOptions arrays - existing data', () => {
		Events = new CSEvents();

		// set categories and categoryOptions so we can check new key added
		Events.categories = ['Bananas'];
		Events.categoryOptions = [{ id: 43, name: 'Bananas' }];
		
		Events.buildIdNameOption('category', exampleCategory, 'categories');

		expect(Events.categories).toEqual(['Bananas', 'Kids']);
		expect(Events.categoryOptions).toEqual([
			{ id: 43, name: 'Bananas' },
			{ id: 5, name: 'Kids' },
		]);
	});

	test('site - non-custom legacy key', () => {
		Events = new CSEvents();

		let exampleSite = {
			id: 47,
			name: 'Test Site',
		};
		
		Events.buildIdNameOption('site', exampleSite);

		expect(Events.sites).toEqual(['Test Site']);
		expect(Events.siteOptions).toEqual([{ id: 47, name: 'Test Site' }]);
	});
})