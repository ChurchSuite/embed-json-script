export default class Brand {
	/**
	 * Creates an Brand from the JSON feed data array.
	 * @param {object} json
	 */
	constructor(json) {
		this.id = json.id
		this.name = json.name
		this.emblem = json.emblem
		this.logo = json.logo.full
		this.color = json.color
		this.css = json.css
	}
}