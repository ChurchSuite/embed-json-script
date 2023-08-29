export default () => ({
	// logic for filter multiselects
	// the filter variable passed in here is a string matching the filter on the parent - e.g. 'day'
	options: [],
	showDropdown: false,
	valueProxy: null,

	isSelected(option) {
		return !Array.isArray(this.valueProxy) ? false : this.valueProxy.includes(option)
	},

	selectedNames(placeholder) {
		// return the placeholder for a null value
		if (!this.valueProxy || this.valueProxy.length == 0) return placeholder
		// otherwise loop over the options and build the name
		return this.options
			.map(o => (this.valueProxy.includes(o.id) ? o.name : null))
			.filter(v => v)
			.join(', ')
	},

	/*
	 * Toggle an option in one of the multiselect filters
	 */
	toggle(option) {
		if (!Array.isArray(this.valueProxy)) this.valueProxy = [] // reset in case single select on same page
		if (this.valueProxy.includes(option)) {
			// unset the option
			this.valueProxy = this.valueProxy.filter(value => value != option)
		} else {
			// set the option
			// NOTE using .push() doesn't trigger watch - https://github.com/alpinejs/alpine/issues/383
			this.valueProxy = this.valueProxy.concat([option])
		}
	},
})
