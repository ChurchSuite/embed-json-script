export default class Resource {
	/**
	 * Creates an Organisation from the JSON feed data array.
	 * @param {object} json
	 */
	constructor(json) {
		this.id = json.id
		this.name = json.name
		this.colour = json.colour
		this.status = json.status
	}
}

