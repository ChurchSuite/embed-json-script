export default class Group {

	/**
	 * Creates a Group from the JSON feed data array.
	 * @param {object} json
	 */
	constructor(json) {
		this.active = this.isActive(json)
		this.customFields = json.custom_fields.constructor === Object ? this.buildCustomFields(json) : null // if no custom fields, JSON provides an empty array
		this.dateStart = dayjs(json.date_start);
		this.day = json.day != null ? dayjs().isoWeekday(json.day) : null;
		this.description = json.description;
		this.embedSignup = json.embed_signup == 1;
		this.endingSoon = this.isEndingSoon(json);
		this.frequency = json.frequency == 'custom' ? json.custom_frequency : json.frequency;
		this.id = json.id;
		this.image = json.images != null && json.images.constructor === Object ? json.images.md.url : '';
		this.link = json.embed_signup == 1 || json.signup_enabled == 0 ? CSJsonFeed.url + '/groups/' + json.identifier : '';
		this.location = json.location.name;
		this.labels = json.labels;
		this.latitude = json.location.latitude;
		this.longitude = json.location.longitude;
		this.members = json.no_members;
		this.name = json.name;
		this.online = json.location.type == 'online';
		this.signupCapacity = json.signup_capacity;
		this.signupStart = json.signup_date_start != null ? dayjs(json.signup_date_start) : null;
		this.signupEnd = json.signup_date_end != null ? dayjs(json.signup_date_end) : null;
		this.signupRunning = this.signupIsRunning(json);
		this.signupInFuture = this.signupInFuture();
		this.site = json.site != null ? json.site.name : null;
		this.tags = json.tags;
		this.tagsMatch = json.tagsMatch;
		this.time = json.time != null ? dayjs((new Date()).toISOString().slice(0, 11) + json.time + ':00') : null;
	}

	/**
	 * Build a more helpful array of custom field data for a group from the 3 available versions
	 */
	buildCustomFields(json) {
		// create a formatted list of custom fields
		let formattedCustomFields = [];
		Object.entries(json.custom_fields).forEach(customField => {
			const field = customField[1];
			// just use the version with a formatted_value
			if (field.constructor === Object && field.hasOwnProperty('formatted_value') && field.settings.embed.view) {
				// only add if this field is visible in embed
				formattedCustomFields.push({
					id: field.id,
					name: field.name,
					value: field.formatted_value
				});
			}
		});

		return formattedCustomFields;
	}

	dayMatches(value) {
		let dayValue = Array.isArray(value) ? value : (!value ? [] : [value]);
		return this.day == null || !dayValue.length || dayValue.includes(this.day.format('dddd'));
	}

	/**
	 * Return a boolean as to whether a group is active or not
	 * @param {Object} group The group in question.
	 * @returns {boolean} Whether the group is currently active.
	 */
	isActive(group) {
		let now = dayjs();
		// if the start date isn't in the past, group isn't active
		if (!dayjs(group.date_start).isBefore(now)) return false;
		if (group.date_end) {
			// if the end date is set and isn't in the future, group isn't active
			if (!dayjs(group.date_end).isAfter(now)) return false;
		}

		return true;
	}

	/**
	 * Return a boolean as to whether a group is ending in the next month.
	 * @param {Object} group The group in question.
	 * @returns {boolean} Whether the group ends in the next month.
	 */
	isEndingSoon(group) {
		if (!group.date_end) return false;

		let now = dayjs();
		let dateEnd = dayjs(group.date_end);
		if (dateEnd.subtract(1, 'month').isBefore(now)) return true;

		return false;
	}

	labelMatches(value) {
		// need to match them all so set up an array of matches
		// let filterValues = [], filterMatches = [];
		let result = true
		Object.values(value).forEach(v => {
			if (v.value !== null && v.value.length && result) {
				// set up a bool for if the label had been found
				let labelFound = false
				this.labels.forEach(label => {
					if (label.id == v.id) {
						// if this is the right label mark as found
						labelFound = true
						// now check for a match - update result if false
						if (!label.value.includes(v.value)) result = false
					}
				})
				// if this group doesn't have this label then update result
				if (!labelFound) result = false
			}
		})

		return result;
	}

	signupInFuture() {
		return this.embedSignup != '' && this.signupStart != null && this.signupStart.isAfter(dayjs(new Date()));
	}

	/**
	 * Return a boolean as to whether a group currently has signup active and running.
	 * @param {Object} group The group in question.
	 * @returns {boolean} Whether the group signup is running.
	 */
	signupIsRunning(group) {
		// group must have signup enabled and a signup start date
		if (!group.signup_enabled || !group.embed_signup) return false;
		if (!group.signup_date_start) return false;

		let now = dayjs();
		let dateStart = dayjs(group.signup_date_start);

		// check that signup started before now
		if (!dateStart.isBefore(now)) return false;

		// if signup has an end date, check it is in the future
		if (group.signup_date_end) {
			let dateEnd = dayjs(group.signup_date_end);
			if (!dateEnd.isAfter(now)) return false;
		}

		return true;
	}

	siteMatches(value) {
		let sitesValue = Array.isArray(value) ? value : (value ? [value] : []);
		return this.site == null || !sitesValue.length || sitesValue.includes(this.site);
	}

	tagMatches(value) {
		let tagValue = Array.isArray(value) ? value : (value ? [value] : []);
		let modelTags = Array.isArray(this.tags) ? this.tags.map(tag => tag.name) : [];
		return CSMultiSelect().matches(modelTags, tagValue, this.tagsMatch);
	}

}