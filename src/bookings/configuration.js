export default class Configuration {
	/**
	 * Creates an Embed Configuration from the JSON feed data array.
	 * @param {object} json
	 */
	constructor(json) {
		this.uuid = json.uuid,
		this.brand_id = json.brand_id,
		this.name = json.name,
		this.description = json.description,
		this.filterByResource = json.filter_by_resources,
		this.numOfMonths = json.num_months,
		this.weekStartDay = json.week_start_day
		this.dayStartTime = json.day_start_time
		this.dayEndTime = json.day_end_time
	}
}
