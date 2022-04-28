export default class Church {

	/**
	 * Creates a Church from the JSON feed data array.
	 * @param {object} json
	 */
	constructor(json) {
		this.charity_number = json.charity_number;
		this.customFields = json.custom_fields;
		this.email = json.email;
		this.image = json.images != null && json.images.constructor === Object ? json.images.md.url : '';
		this.meetingAddress = json.meeting_address;
		this.latitude = json.meeting_address.latitude;
		this.longitude = json.meeting_address.longitude;
		this.name = json.name;
		this.officeAddress = json.office_address;
		this.singleAddress = json.single_address;
		this.site = json.site != null ? json.site.name : null;
		this.telephone = json.telephone;
		this.urls = json.urls;
	}

	siteMatches(value) {
		const sitesValue = Array.isArray(value) ? value : (value ? [value] : []);
		return this.site == null || sitesValue.length == 0 || sitesValue.includes(this.site);
	}

}