export default class BookedResource {
	/**
	 * Creates an Organisation from the JSON feed data array.
	 * @param {object} json
	 */
	constructor(json) {
		this.end = dayjs(json.datetime_end)
		this.name = json.name
		this.quantity = json.quantity
		this.resourceId = json.resource_id
		this.start = dayjs(json.datetime_start)
		this._original = json
	}
}

