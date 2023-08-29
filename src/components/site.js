import Address from './address'

export default class Site {
	/**
	 * Creates a Site from the JSON feed data array.
	 * @param {object} json
	 */
	constructor(json) {
		this.id = json.id
		this.name = json.name
		this.initials = json.initials
		this.color = json.color
		this.order = json.order
		this.address = new Address(json.address)
	}
}