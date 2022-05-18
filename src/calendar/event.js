export default class Event {

	/**
	 * Creates an Event from the JSON feed data array.
	 * @param {object} json
	 */
	constructor(json) {
		// sort out link URL
		let link = ''
		if (json.signup_options.embed.enabled == 1) {
			link = json.signup_options.tickets.url
		} else if (json.signup_options.signup_enabled == 1) {
			link = CS.url + '/events/' + json.identifier
		}

		this.allDay = json.datetime_start.slice(-8) == '00:00:00' && json.datetime_end.slice(-8) == '23:59:59'
		this.brandEmblem = json.brand.emblem
		this.category = json.category != null ? json.category.name : null
		this.description = json.description
		this.end = dayjs(json.datetime_end)
		this.image = json.images != null && json.images.constructor === Object ? json.images.md.url : json.brand.emblem
		this.link = link
		this.location = json.location.name
		this.latitude = json.location.latitude
		this.longitude = json.location.longitude
		this.name = json.name
		this.online = json.location.type == 'online'
		this.postcode = json.location.address
		this.signupEnabled = link != ''
		this.site = json.site != null ? json.site.name : null
		this.start = dayjs(json.datetime_start)
		// add in the original json
		this._original = json
	}

}