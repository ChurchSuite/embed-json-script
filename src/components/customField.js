export default class CustomField {

	/**
	 * Creates a Custom Field from the JSON feed data array.
	 * @param {object} json
	 */
	constructor(json) {
		this.id = json.id
		this.type = json.type
		this.name = json.name
		this.help = json.help
		this.options = json.options
	}

}