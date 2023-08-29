export default class Address {
	/**
	 * Creates an Address from the JSON feed data array.
	 * @param {object} json
	 */
	constructor(json) {
		this.line1 = json.line1
		this.line2 = json.line2
		this.line3 = json.line3
		this.city = json.city
		this.county = json.county
		this.country = json.country
		this.postcode = json.postcode
	}
}