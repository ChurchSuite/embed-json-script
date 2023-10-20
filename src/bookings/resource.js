export default class Resource {
	/**
	 * Creates an Organisation from the JSON feed data array.
	 * @param {object} json
	 */
	constructor(json) {
		this.id = json.id
		this.name = json.name
		this.category = json.category
		this.status = json.status
		this.quantity = json.quantity
		this.description = json.description
	}
}

