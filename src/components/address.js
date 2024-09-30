export default class Address {
	/**
	 * Creates an Address from the JSON feed data array.
	 * @param {object} json
	 */
	constructor(json) {
		this.line1 = json.line_1
		this.line2 = json.line_2
		this.line3 = json.line_3
		this.city = json.city
		this.county = json.county
		this.country = json.country
		this.postcode = json.postcode
		this.latitude = json.latitude
		this.longitude = json.longitude
	}
}