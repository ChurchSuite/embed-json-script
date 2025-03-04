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
		this.filterByCluster = json.filter_by_clusters,
		this.filterByLabel = json.filter_by_labels,
		this.filterBySite = json.filter_by_sites,
		this.filterByView = json.filter_by_view,
		this.format = json.format,
		this.layout = json.layout,
		this.showDetails = json.show_details,
		this.showCustomFields = json.show_custom_fields,
		this.showLabels = json.show_labels,
		this.showFilters = json.show_filters,
		this.showFilterLabels = json.show_filter_labels
	}

}
