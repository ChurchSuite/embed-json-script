export default class Label {
	/**
	 * Creates a Label from the JSON feed data array.
	 * @param {object} json
	 */
	constructor(json) {
		this.id = json.id
		this.name = json.name
		this.color = json.color
		this.multiple = json.multiple
		this.required = json.required
		this.options = json.options
	}
}