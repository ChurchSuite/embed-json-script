import Configuration from '../../src/calendar/configuration'

const json = {
	uuid: "62436903-841e-4239-bc95-e6952e17430e",
	brand_id: 18,
	name: "Featured Events 1",
	description: "DO NOT DELETE - Live on the Kings Hope site - 9 events - featured only - combine by sign up to sequence - show search and category filters - list / grid 2",
	filter_by_categories: [],
	filter_by_featured: true,
	filter_by_sites: [],
	format: "list",
	layout: "grid",
	merge_events: "signup_to_sequence",
	num_events: 9,
	num_months: 12,
	show_filters: [
		"search",
		"category",
		"site"
	],
	week_start_day: null
}

const config = new Configuration(json);

test('uuid property', () => expect(config.uuid).toBe(json.uuid));
test('brand_id property', () => expect(config.brand_id).toBe(json.brand_id));
test('name property', () => expect(config.name).toBe(json.name));
test('description property', () => expect(config.description).toBe(json.description));
test('filterByCategory property', () => expect(config.filterByCategory).toBe(json.filter_by_categories));
test('filterByFeatured property', () => expect(config.filterByFeatured).toBe(json.filter_by_featured));
test('filterBySite property', () => expect(config.filterBySite).toBe(json.filter_by_sites));
test('format property', () => expect(config.format).toBe(json.format));
test('layout property', () => expect(config.layout).toBe(json.layout));
test('mergeEvents property', () => expect(config.mergeEvents).toBe(json.merge_events));
test('numOfEvents property', () => expect(config.numOfEvents).toBe(json.num_events));
test('numOfMonths property', () => expect(config.numOfMonths).toBe(json.num_months));
test('showFilters property', () => expect(config.showFilters).toBe(json.show_filters));
test('weekStartDay property', () => expect(config.weekStartDay).toBe(json.week_start_day));

describe('test numOfEvents property for calendar and list', () => {
	let calJson = {...json, format: 'calendar', num_events: 12}
	let calConfig = new Configuration(calJson)
	test('numOfEvents is null for calendar, even if provided', () => {
		expect(calConfig.numOfEvents).toEqual(null)
	})

	let listJson = {...json, format: 'list', num_events: 12}
	let listConfig = new Configuration(listJson)
	test('numOfEvents is applied for list', () => {
		expect(listConfig.numOfEvents).toEqual(12)
	})
})