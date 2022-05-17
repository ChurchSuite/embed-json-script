export default class Event {

	/**
	 * Creates an Event from the JSON feed data array.
	 * @param {object} json
	 */
	constructor(json) {
		// sort out link URL
		let link = '';
		if (json.signup_options.embed.enabled == 1) {
			link = json.signup_options.tickets.url;
		} else if (json.signup_options.signup_enabled == 1) {
			link = CSJsonFeed.url + '/events/' + json.identifier;
		}

		this.allDay = json.datetime_start.slice(-8) == '00:00:00' && json.datetime_end.slice(-8) == '23:59:59';
		this.brandEmblem = json.brand.emblem;
		this.category = json.category != null ? json.category.name : null;
		this.dateTimeEnd = dayjs(json.datetime_end);
		this.dateTimeStart = dayjs(json.datetime_start);
		this.description = json.description;
		this.image = json.images != null && json.images.constructor === Object ? json.images.md.url : json.brand.emblem;
		this.link = link;
		this.location = json.location.name;
		this.latitude = json.location.latitude;
		this.longitude = json.location.longitude;
		this.name = json.name;
		this.online = json.location.type == 'online';
		this.postcode = json.location.address;
		this.signupEnabled = link != '';
		this.site = json.site != null ? json.site.name : null;
	}

	searchMatches(value) {
		if (!value.length) return true;

		// build a model search name with varying levels of date formats and event info
		let searchName = (
			this.name
			+ ' ' + this.dateTimeStart.format('M D YY')
			+ ' ' + this.dateTimeStart.format('D M YY')
			+ ' ' + this.dateTimeStart.format('MM DD YY')
			+ ' ' + this.dateTimeStart.format('DD MM YY')
			+ ' ' + this.dateTimeStart.format('MMM DD YY')
			+ ' ' + this.dateTimeStart.format('DD MMM YY')
			+ ' ' + this.dateTimeStart.format('MMMM DD YY')
			+ ' ' + this.dateTimeStart.format('DD MMMM YY')
			+ ' ' + this.dateTimeStart.format('M D YYYY')
			+ ' ' + this.dateTimeStart.format('D M YYYY')
			+ ' ' + this.dateTimeStart.format('MM DD YYYY')
			+ ' ' + this.dateTimeStart.format('DD MM YYYY')
			+ ' ' + this.dateTimeStart.format('MMM DD YYYY')
			+ ' ' + this.dateTimeStart.format('DD MMM YYYY')
			+ ' ' + this.dateTimeStart.format('MMMM DD YYYY')
			+ ' ' + this.dateTimeStart.format('DD MMMM YYYY')
			+ ' ' + this.location
			+ ' ' + this.category
		).replace(/[\s\/\-\.]+/gi, ' ').toLowerCase();
		return searchName.includes(value);
	}

	categoryMatches(categoryName) {
		return !categoryName.length || this.category == categoryName;
	}

	siteMatches(value) {
		let sitesValue = Array.isArray(value) ? value : (value ? [value] : []);
		return this.site == null || !sitesValue.length || sitesValue.includes(this.site);
	}

}