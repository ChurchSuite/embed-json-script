export default class Label {
	/**
	 * Creates a Label from the JSON feed data array.
	 * @param {object} json
	 */
	constructor(json) {
		this.id = json.id
		this.name = json.name
		this.color = json.colour
		this.multiple = json.multiple_responses
		this.options = json.options
	}
}