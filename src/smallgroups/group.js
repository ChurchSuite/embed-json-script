export default class Group {
	/**
	 * Creates a Group from the JSON feed data array.
	 * @param {object} json
	 */
	constructor(json) {
		this.active = this.isActive(json)
		this.clusterId = json.cluster != null ? json.cluster.id : null
		this.customFields =
			json.custom_fields.constructor === Object ? this.buildCustomFields(json) : null // if no custom fields, JSON provides an empty array
		this.dateEnd = json.date_end ? dayjs(json.date_end) : null
		this.dateStart = dayjs(json.date_start)
		this.day = json.day != null ? dayjs().isoWeekday(json.day) : null
		this.embedSignup = json.embed_signup == 1
		this.endingSoon = this.isEndingSoon(json)
		this.id = json.id
		this.image =
			json.images != null && json.images.constructor === Object ? json.images.md.url : ''
		this.labels = json.labels
		this.link =
			json.embed_signup == 1 || json.signup_enabled == 0
				? CS.detectURLScheme() + CS.url + '/groups/' + json.identifier
				: ''
		this.members = json.num_members
		this.name = json.name
		this.signupCapacity = json.signup_capacity
		this.signupFull = json.signup_full
		this.signupStart = dayjs(json.signup_date_start)
		this.signupEnd = json.signup_date_end ? dayjs(json.signup_date_end) : null
		this.signupRunning = this.signupIsRunning(json)
		this.signupInFuture = this.signupInFuture()
		this.siteId = json.site_id ? parseInt(json.site_id) : null
		this._original = json

		// optional configuration details
		this.description = json.description
		this.frequency = json.frequency == 'custom' ? json.custom_frequency : json.frequency
		this.location = json.location != null && json.location.constructor === Object ? json.location.name : null
		this.latitude = json.location != null && json.location.constructor === Object ? json.location.latitude : null
		this.longitude = json.location != null && json.location.constructor === Object ? json.location.longitude : null
		this.online = json.location != null && json.location.constructor === Object ? json.location.type == 'online' : null
		this.time =
			json.time != null
				? dayjs(new Date().toISOString().slice(0, 11) + json.time + ':00')
				: null
	}

	/**
	 * Build a more helpful array of custom field data for a group from the 3 available versions
	 */
	buildCustomFields(json) {
		// create a formatted list of custom fields
		let formattedCustomFields = []
		Object.entries(json.custom_fields).forEach(customField => {
			const field = customField[1]
			// just use the version with a formatted_value
			if (
				field.constructor === Object &&
				field.hasOwnProperty('formatted_value')
			) {
				// only add if this field is visible in embed
				formattedCustomFields.push({
					id: field.id,
					name: field.name,
					value: field.formatted_value,
					_original: [
						json.custom_fields['custom' + field.id],
						json.custom_fields['field' + field.id],
						json.custom_fields['field_' + field.id],
					],
				})
			}
		})

		return formattedCustomFields.length > 0 ? formattedCustomFields : null
	}

	/**
	 * Return a boolean as to whether a group is active or not
	 * @param {Object} group The group in question.
	 * @returns {boolean} Whether the group is currently active.
	 */
	isActive(group) {
		let now = dayjs()
		// if the start date isn't in the past, group isn't active
		if (!dayjs(group.date_start).isBefore(now)) return false
		if (group.date_end) {
			// if the end date is set and isn't in the future, group isn't active
			if (!dayjs(group.date_end).isAfter(now)) return false
		}

		return true
	}

	/**
	 * Return a boolean as to whether a group is ending in the next month.
	 * @param {Object} group The group in question.
	 * @returns {boolean} Whether the group ends in the next month.
	 */
	isEndingSoon(group) {
		if (!group.date_end) return false

		let now = dayjs()
		let dateEnd = dayjs(group.date_end)
		if (dateEnd.isBefore(now)) return false
		if (dateEnd.subtract(1, 'month').isBefore(now)) return true

		return false
	}

	signupInFuture() {
		return (
			this.embedSignup != '' &&
			this.signupStart != null &&
			this.signupStart.isAfter(dayjs(new Date()))
		)
	}

	/**
	 * Return a boolean as to whether a group currently has signup active and running.
	 * @param {Object} group The group in question.
	 * @returns {boolean} Whether the group signup is running.
	 */
	signupIsRunning(group) {
		// group must have signup enabled and a signup start date
		if (!group.signup_enabled || !group.embed_signup) return false
		if (!group.signup_date_start) return false

		let now = dayjs()
		let dateStart = dayjs(group.signup_date_start)

		// check that signup started before now
		if (!dateStart.isBefore(now)) return false

		// if signup has an end date, check it is in the future
		if (group.signup_date_end) {
			let dateEnd = dayjs(group.signup_date_end)
			if (!dateEnd.isAfter(now)) return false
		}

		return true
	}
}
