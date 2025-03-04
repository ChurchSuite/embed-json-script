export default class Group {
	/**
	 * Creates a Group from the JSON feed data array.
	 * @param {object} json
	 */
	constructor(json) {
		const dayMap = {
			sunday: 0,
			monday: 1,
			tuesday: 2,
			wednesday: 3,
			thursday: 4,
			friday: 5,
			saturday: 6
		};

		this.active = this.isActive(json)
		this.clusterId = json.cluster_id
		this.customFields = json.custom_fields
		this.customFrequency = !['fortnightly','monthly','quarterly','weekly'].includes(json.frequency)
		this.dateEnd = json.ends_at ? dayjs(json.ends_at) : null
		this.dateStart = json.starts_at ? dayjs(json.starts_at) : null
		this.day = json.day
		this.dayInt = json.day && json.day != 'various days' ? dayMap[json.day] : null
		this.signupEnabled = json.signup_options != null
		this.endingSoon = this.isEndingSoon(json)
		this.id = json.id
		this.identifier = json.identifier
		this.image = json.image == null ? null : {
			thumbnail: json.image.thumbnail,
			small: json.image.small,
			medium: json.image.medium,
			large: json.image.large,
		}
		this.labels = json.labels
		this.link = this.signupEnabled
			? CS.detectURLScheme() + CS.url + '/groups/' + json.identifier
			: ''
		this.members = json.num_members
		this.name = json.name
		this.signupCapacity = json.signup_options?.capacity
		this.signupFull = this.members >= this.signupCapacity
		this.signupStart = json.signup_options ? dayjs(json.signup_options.starts_at) : null
		this.signupEnd = json.signup_options?.ends_at ? dayjs(json.signup_options.ends_at) : null
		this.signupRunning = this.signupIsRunning(json)
		this.signupInFuture = this.signupInFuture()
		this.allSites = json.all_sites
		this.siteIds =json.site_ids

		// optional configuration details
		this.description = json.description
		this.frequency = json.frequency
		this.location = json.location?.name
		this.latitude = json.location?.latitude
		this.longitude = json.location?.longitude
		this.online = json.location != null ? json.location.type == 'online' : null
		this.time =
			json.time != null
				? dayjs(new Date().toISOString().slice(0, 11) + json.time + ':00')
				: null
	}

	/**
	 * Return a boolean as to whether a group is active or not
	 * @param {Object} group The group in question.
	 * @returns {boolean} Whether the group is currently active.
	 */
	isActive(group) {
		let now = dayjs()
		if (!group.starts_at) return true;
		// if the start date isn't in the past, group isn't active
		if (!dayjs(group.starts_at).isBefore(now)) return false
		if (group.ends_at) {
			// if the end date is set and isn't in the future, group isn't active
			if (!dayjs(group.ends_at).isAfter(now)) return false
		}

		return true
	}

	/**
	 * Return a boolean as to whether a group is ending in the next month.
	 * @param {Object} group The group in question.
	 * @returns {boolean} Whether the group ends in the next month.
	 */
	isEndingSoon(group) {
		if (!group.ends_at) return false

		let now = dayjs()
		let dateEnd = dayjs(group.ends_at)
		if (dateEnd.isBefore(now)) return false
		if (dateEnd.subtract(1, 'month').isBefore(now)) return true

		return false
	}

	/**
	 * @returns {boolean} Whether the group has signup enabled, and that signup starts in the future.
	 */
	signupInFuture() {
		return (
			this.signupEnabled &&
			this.signupStart.isAfter(dayjs(new Date()))
		)
	}

	/**
	 * Return a boolean as to whether a group currently has signup active and running.
	 * @param {Object} group The group in question.
	 * @returns {boolean} Whether the group signup is running.
	 */
	signupIsRunning(group) {
		// group must have signup enabled
		if (!group.signup_options) return false

		let now = dayjs()
		let dateStart = dayjs(group.signup_options.starts_at)

		// check that signup started before now
		if (!dateStart.isBefore(now)) return false

		// if signup has an end date, check it is in the future
		if (group.signup_options.ends_at) {
			let dateEnd = dayjs(group.signup_options.ends_at)
			if (!dateEnd.isAfter(now)) return false
		}

		return true
	}
}
