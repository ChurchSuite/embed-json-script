export default class Booking {
	/**
	 * Creates an Organisation from the JSON feed data array.
	 * @param {object} json
	 */
	constructor(json) {
		this.id = json.booking_id
		this.name = json.booking_name
		this.start = dayjs(json.booking_datetime_start)
		this.end = dayjs(json.booking_datetime_end)
		this.status = json.booking_status
		this.typeId = json.type_id
		this.siteId = json.site_id
		this._original = json
	}
}

