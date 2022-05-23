import "./cs"
import Church from "./churches/church"

document.addEventListener('alpine:init', () => {
	Alpine.data('CSChurches', (options = {}) => ({...CS(options), ...{
		// Configuration & Options
		filterKeys: ['label', 'search', 'site'],
		resourceModule: 'churches',

		churches() { return this.models },

		// Filter Data
		label: {},
		labels: [],
		labelsProcessed: [],
		search: '',
		searchQuery: '',
		site: '', // site dropdown value
		sites: [], // array of possible site values

		buildModelObject(model) {
			// capture unique sites
			if (model.site != null && !this.sites.includes(model.site.name)) this.sites.push(model.site.name)
			this.sites.sort()

			// loop the labels and capture them
			if (this.options.hasOwnProperty('show_labels')) {
				this.options.show_labels.forEach(labelId => {
					if (this.labelsProcessed.includes(labelId)) return
					// try and find this label on the model
					model.labels.forEach(label => {
						if (label.id == labelId) {
							this.labels.push({
								id: label.id,
								multiple: label.multiple,
								name: label.name,
								options: label.options,
								required: label.required,
							})
							this.labelsProcessed.push(labelId)
							this.label[labelId] = {
								id: labelId,
								value: null
							}

							this.$watch('label['+labelId+'].value', (v) => {
								this.filterModels()
							})

						}
					})
				})
			}

			// build and return the model object
			return new Church(model)
		},

		/**
		 * Returns true if we should be filtering models.
		 */
		filterModelsEnabled() {
			// first update the searchQuery so we don't do it for every model in this.filterModel() - replace date separators with spaces
			this.searchQuery = this.search.replace(/[\s\/\-\.]+/gi, ' ').toLowerCase()
			return true
		},

		/**
		 * Returns true if the given model should be visible, based on the filters.
		 */
		filterModel(model) {
			return this.filterModel_Label(model)
				&& this.filterModel_Site(model)
		},

		filterModel_Label(model) {
			// need to match them all so set up an array of matches
			// let filterValues = [], filterMatches = [];
			let result = true
			Object.values(this.label).forEach(v => {
				if (v.value !== null && v.value.length && result) {
					// set up a bool for if the label had been found
					let labelFound = false
					model._original.labels.forEach(label => {
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
		},

		filterModel_Site(model) {
			const sitesValue = Array.isArray(this.site) ? this.site : (this.site ? [this.site] : [])
			return model.site == null || sitesValue.length == 0 || sitesValue.includes(model.site)
		}

	}}))
})