export default class BookedResource {
	/**
	 * Creates an Organisation from the JSON feed data array.
	 * @param {object} json
	 */
	constructor(json) {
		this.end = dayjs(json.ends_at)
		this.id = json.id
		this.name = json.name
		this.quantity = json.quantity
		this.resourceId = json.resource_id
		this.start = dayjs(json.starts_at)
	}
}

