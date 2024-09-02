export default class Organisation {
	/**
	 * Creates an Organisation from the JSON feed data array.
	 * @param {object} json
	 */
	constructor(json) {
		this.charityNumber = json.charity_number
		this.customFields = json.custom_fields
		this.email = json.email
		this.id = json.id
		this.image =
			json.images != null && json.images.constructor === Object ? json.images.md.url : ''
		this.meetingAddress = json.meeting_address
		this.labels = json.labels
		this.latitude = json.meeting_address ? json.meeting_address.latitude : null
		this.longitude = json.meeting_address ? json.meeting_address.longitude : null
		this.name = json.name
		this.officeAddress = json.office_address
		this.singleAddress = json.single_address
		this.siteId = json.site_id
		this.telephone = json.telephone
		this.urls = json.urls
		this._original = json
	}
}
