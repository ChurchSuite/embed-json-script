export default class Event {
	/**
	 * Creates an Event from the JSON feed data array.
	 * @param {object} json
	 */
	constructor(json) {
		this.allDay =
			json.starts_at.slice(-9) == '00:00:00Z' && json.ends_at.slice(-9) == '23:59:59Z'
		this.allSites = json.all_sites
		this.categoryId = json.category_id
		this.description = json.description
		this.end = dayjs(json.ends_at)
		this.id = json.id
		this.identifier = json.identifier
		this.image = json.image == null ? null : {
			thumbnail: json.image.thumbnail,
			small: json.image.small,
			medium: json.image.medium,
			large: json.image.large,
		}
		this.latitude = json.location.latitude
		this.link = json.url
		this.location = json.location.name
		this.longitude = json.location.longitude
		this.meetingUrl = json.location.type == 'online' ? json.location.url : null
		this.mergeIdentifier = json.merge_identifier
		this.name = json.name
		this.online = json.location.type == 'online'
		this.postcode = json.location.address
		this.sequenceId = json.sequence_id
		this.signupEnabled = json.signup_enabled
		this.siteIds = json.site_ids
		this.start = dayjs(json.starts_at)
		this.status = json.status
	}
}
