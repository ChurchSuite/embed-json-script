import "./cs"
import Church from "./churches/church"

document.addEventListener('alpine:init', () => {
	Alpine.data('CSChurches', (options = {}) => ({...CS(options), ...{
		// Configuration & Options
		filterKeys: ['label', 'search', 'site'],
		resourceModule: 'churches',

		churches() { return this.models },

		// Filter Data
		label: {}, // label id keyed object of values - populated when building objects
		labels: [],

		search: null,
		searchQuery: null,

		site: null, // site string for filterModels()
		siteOptions: [], // id and name site options
		sites: [], // @deprecated sites name array

		buildModelObject(model) {
			// capture unique sites
			this.buildIdNameOption('site', model.site)
			this.sites.sort()

			// loop the labels and capture them
			if (this.options.hasOwnProperty('show_labels')) {
				let labelIds = Object.keys(this.label)
				let labelsIds = this.labels.map(l => ''+l.id)
console.log(this.options);
				this.options.show_labels.forEach(labelId => {
					// try and find this label on the model
console.log(model);
					(model.labels || []).forEach(label => {
						if (label.id == labelId) {
							// don't add a label object unless we need it by id
							if (!labelsIds.includes(''+label.id)) {
								this.labels.push({
									id: label.id,
									multiple: label.multiple,
									name: label.name,
									options: label.options,
									required: label.required,
								})
							}
						}
					})

					// don't add a label filter value unless we need it by id
					if (!labelIds.includes(''+labelId)) {
						this.label[labelId] = {
							id: labelId,
							value: null
						}
						this.$watch('label['+labelId+'].value', (v) => {
							this.filterModels()
						})
					}
				})
			}

			// build and return the model object
			return new Church(model)
		},

		/**
		 * This method maps the configuration settings over to json script options
		 */
		mapConfiguration() {
			// map across any configuration keys and data
			if (this.configuration.hasOwnProperty('id')) {
				let configurationMap = {
					showFilterLabels: 'show_labels',
					showFilterSites: 'show_sites',
				}

				Object.keys(configurationMap).forEach(o => {
					if (this.configuration.hasOwnProperty(o)) {
						// set the options key
						this.options[configurationMap[o]] = this.configuration[o]
					}
				})
			}
		},

		/**
		 * Returns true if we should be filtering models.
		 */
		filterModelsEnabled() {
			// first update the searchQuery so we don't do it for every model in this.filterModel() - replace date separators with spaces
			let q = (this.search || '')
			this.searchQuery = q.length ? q.replace(/[\s\/\-\.]+/gi, ' ').toLowerCase() : null
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
			let result = true
			Object.values(this.label).forEach(v => {
				let labelFilter = this.filterValue('value', v)
				if (!labelFilter) return;

				// set up a bool for if the label had been found
				let labelFound = false
				model._original.labels.forEach(label => {
					if (label.id == v.id) {
						// if this is the right label mark as found
						labelFound = true
						// now check for a match - update result if false
						filterResult = false
						labelFilter.forEach(filter => {
							// if we find at least one match then set this filterResult to true
							if (label.value.includes(filter)) filterResult = true
						})

						if (!filterResult) result = false
					}
				})
				// if this group doesn't have this label then update result
				if (!labelFound) result = false
			})

			return result
		},

		filterModel_Site(model) {
			let siteFilter = this.filterValue('site')
			// no filter
			if (siteFilter == null) return true
			// all sites groups
			if (model._original.site == null) return true
			// return on id or name for legacy support
			return siteFilter.includes(''+model._original.site.id)
				|| siteFilter.includes(''+model._original.site.name)
		},

	}}))
})