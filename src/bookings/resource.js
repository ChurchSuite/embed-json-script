export default class Resource {
	/**
	 * Creates an Organisation from the JSON feed data array.
	 * @param {object} json
	 */
	constructor(json) {
		this.id = json.resource_id
		this.name = json.resource.name
		this.category = json.resource.category
		this.status = json.resource.status
		this.quantity = json.resource.quantity
		this.description = json.resource.description
	}
}

