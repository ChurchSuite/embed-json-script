export default class Configuration {
	/**
	 * Creates an Embed Configuration from the JSON feed data array.
	 * @param {object} json
	 */
	constructor(json) {
        this.uuid = json.uuid,
        this.brand_id = json.brand_id,
        this.name = json.name,
        this.description = json.description,
        this.filterByCategory = json.filter_by_categories,
        this.filterByFeatured = json.filter_by_featured,
        this.filterBySite = json.filter_by_sites,
        this.format = json.format,
        this.layout = json.layout,
        this.mergeEvents = json.merge_events,
        this.numOfEvents = json.num_events,
        this.numOfMonths = json.num_months,
        this.showFilters = json.show_filters,
        this.weekStartDay = json.week_start_day
	}
}
