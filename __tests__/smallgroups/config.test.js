import Configuration from '../../src/smallgroups/configuration'

const json = {
	'uuid': '4e003d61-0199-4ff6-9f73-19e207c03e68',
	'brand_id': 18,
	'name': 'Kings Hope Church Group Map',
	'description': 'Used on kingshope.church - DO NOT MAKE CHANGES',
	'filter_by_clusters': [],
	'filter_by_labels': [],
	'filter_by_sites': [],
	'filter_by_view': 'active_future',
	'format': 'map',
	'layout': 'grid',
	'show_details': [
		'frequency',
		'time',
		'dates'
	],
	'show_custom_fields': [
		2418
	],
	'show_labels': [
		13,
		14,
		15
	],
	'show_filters': [
		'day',
		'site'
	],
	'show_filter_labels': []
}

const config = new Configuration(json);

test('uuid property', () => expect(config.uuid).toBe(json.uuid));
test('brand_id property', () => expect(config.brand_id).toBe(json.brand_id));
test('name property', () => expect(config.name).toBe(json.name));
test('description property', () => expect(config.description).toBe(json.description));
test('filterByCluster property', () => expect(config.filterByCluster).toBe(json.filter_by_clusters));
test('filterByLabel property', () => expect(config.filterByLabel).toBe(json.filter_by_labels));
test('filterBySite property', () => expect(config.filterBySite).toBe(json.filter_by_sites));
test('filterByView property', () => expect(config.filterByView).toBe(json.filter_by_view));
test('format property', () => expect(config.format).toBe(json.format));
test('layout property', () => expect(config.layout).toBe(json.layout));
test('showDetails property', () => expect(config.showDetails).toBe(json.show_details));
test('showCustomFields property', () => expect(config.showCustomFields).toBe(json.show_custom_fields));
test('showLabels property', () => expect(config.showLabels).toBe(json.show_labels));
test('showFilters property', () => expect(config.showFilters).toBe(json.show_filters));
test('showFilterLabels property', () => expect(config.showFilterLabels).toBe(json.show_filter_labels));
