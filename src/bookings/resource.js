export default class Resource {
	/**
	 * Creates a Resource from the JSON feed data array.
	 * @param {object} json
	 */
	constructor(json) {
		this.id = json.id
		this.name = json.name
		this.quantity = json.quantity
		this.description = json.description
		this.site_ids = json.site_ids
		this.all_sites = json.all_sites
	}
}

