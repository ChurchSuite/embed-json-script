export default class Event {
	/**
	 * Creates an Event from the JSON feed data array.
	 * @param {object} json
	 */
	constructor(json) {
		this.allDay =
			json.datetime_start.slice(-8) == '00:00:00' && json.datetime_end.slice(-8) == '23:59:59'
		this.categoryId = json.category_id
		this.description = json.description
		this.end = dayjs(json.datetime_end)
		this.image =
			json.images != null && json.images.constructor === Object ? json.images.md.url : ''
		this.link = json.url
		this.location = json.location.name
		this.latitude = json.location.latitude
		this.longitude = json.location.longitude
		this.name = json.name
		this.online = json.location.type == 'online'
		this.postcode = json.location.address
		this.signupEnabled = json.signup_enabled
		this.siteIds = json.site_ids
		this.start = dayjs(json.datetime_start)
		// add in the original json
		this._original = json
	}
}
