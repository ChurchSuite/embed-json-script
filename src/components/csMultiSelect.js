export default (filter) => ({
	// logic for filter multiselects
	// the filter variable passed in here is a string matching the filter on the parent - e.g. 'day'
	showDropdown: false,

	init() {
		this[filter] = [];
	},

	isSelected(option) {
		return this[filter].includes(option);
	},

	/**
	 * Return a boolean as to whether a model matches a multiselect filter.
	 * Used when a model can have multiple values, e.g. multiple tags.
	 * @param {Array} values The values on the model in question.
	 * @param {Array} multiselect The values selected in the multiselect.
	 * @param {String} matchingBehaviour The matching behaviour - 'all' or 'any'.
	 * @returns {boolean} Whether the model matches.
	 */
	matches(values, multiselect, matchingBehaviour) {
		if (multiselect.length == 0) return true;

		// calculate the intersection between model values and multiselect values
		const matches = values.filter(value => multiselect.includes(value));

		// if matching behaviour 'all', model must have every multiselect value
		if (matchingBehaviour == 'all' && matches.length == multiselect.length) return true;

		// if matching behaviour 'any', model must have one of multiselect values
		if (matchingBehaviour == 'any' && matches.length > 0) return true;

		return false;
	},

	/*
	 * Toggle an option in one of the multiselect filters
	 */
	toggle(option) {
		if (!Array.isArray(this[filter])) this[filter] = [this[filter]]; // reset in case single select on same page
		if (this[filter].includes(option)) {
			// unset the option
			this[filter] = this[filter].filter(value => value != option);
		} else {
			// set the option
			// NOTE using .push() doesn't trigger watch - https://github.com/alpinejs/alpine/issues/383
			this[filter] = this[filter].concat([option]);
		}
	}

})