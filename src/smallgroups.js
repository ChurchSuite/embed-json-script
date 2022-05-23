import "./cs"
import Group from "./smallgroups/group"

document.addEventListener('alpine:init', () => {
	Alpine.data('CSGroups', (options = {}) => ({...CS(options), ...{
		// Configuration & Options
		filterKeys: ['day', 'tag', 'search', 'site', 'label', 'cluster'],
		resourceModule: 'smallgroups',

		groups() { return this.models },

		// Filter Data
		cluster: null,
		clusterOptions: [],
		clusters: [], // @deprecated cluster name array

		day: null, // filterModels() day dropdown string
		dayOptions: [],
		days: [], // @deprecated array to contain days of the week for dropdown

		label: {}, // label id keyed object of values - populated when building objects
		labels: [],

		search: null,
		searchQuery: null,

		site: null, // site string for filterModels()
		siteOptions: [], // id and name site options
		sites: [], // @deprecated sites name array

		tag: null, // tag string for filterModels()
		tagOptions: [],
		tags: [], // @deprecated tags names array

		buildModelObject(model) {
			// capture unique tags, clusters and sites for dropdowns, then sort them
			if (model.tags != null) model.tags.forEach(tag => this.buildIdNameOption('tag', tag))
			this.buildIdNameOption('cluster', model.cluster)
			this.buildIdNameOption('site', model.site)
			this.tags.sort()
			this.sites.sort()

			// loop the labels and capture them
			if (this.options.hasOwnProperty('show_labels')) {
				let labelIds = Object.keys(this.label)
				let labelsIds = this.labels.map(l => ''+l.id)

				this.options.show_labels.forEach(labelId => {
					// try and find this label on the model
					model.labels.forEach(label => {
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
							// don't add a label filter value unless we need it by id
							if (!labelIds.includes(''+label.id)) {
								this.label[labelId] = {
									id: labelId,
									value: null
								}
								this.$watch('label['+labelId+'].value', (v) => {
									this.filterModels()
								})
							}
						}
					})
				})
			}

			return new Group(model)
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
		 * Builds a formatted array of groups data
		 */
		postInit() {
			// load in array of days for day filter dropdown
			this.days = this.daysOfWeek()
			this.dayOptions = this.dayOfWeekOptions()
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
			return this.filterModel_Cluster(model)
				&& this.filterModel_Day(model)
				&& this.filterModel_Label(model)
				&& this.filterModel_Search(model)
				&& this.filterModel_Site(model)
				&& this.filterModel_Tag(model)
		},

		filterModel_Cluster(model) {
			let clusterFilter = this.filterValue('cluster')
			// no filter
			if (clusterFilter == null) return true
			// return on id or name for legacy support
			return clusterFilter.includes(''+model._original.cluster.id)
				|| clusterFilter.includes(''+model._original.cluster.name)
		},

		filterModel_Day(model) {
			let dayValue = this.filterValue('day')
			// no filter
			if (dayValue == null) return true
			// various days for group
			if (model.day == null) return true
			// return on id or name for legacy support
			return dayValue.includes(model.day.format('dddd'))
				|| dayValue.includes(model._original.day)
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

		filterModel_Search(model) {
			// no filter
			if (!this.searchQuery) return true

			// build a model search name with varying levels of date formats and event info
			let searchName = (
				model.name
				+ ' ' + (model.day ? model.day.format('dddd') : '')
				+ ' ' + model.location
				+ ' ' + model.category
			).replace(/[\s\/\-\.]+/gi, ' ').toLowerCase()
			return searchName.includes(this.searchQuery)
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

		filterModel_Tag(model) {
			let tagFilter = this.filterValue('tag')
			// no filter
			if (tagFilter == null) return true

			let modelTagIds = Array.isArray(model._original.tags) ? model._original.tags.map(tag => ''+tag.id) : []
			let modelTagNames = Array.isArray(model._original.tags) ? model._original.tags.map(tag => tag.name) : []
			// there are no tags on the model - doesn't match
			if (!modelTagIds.length) return false

			let result = false
			tagFilter.forEach(t => {
				// if result is false see if this tag is on the model - if so return true
				// returns on id or name for legacy support
				if (modelTagIds.includes(t) || modelTagNames.includes(t) || result) result = true
			})

			// otherwise return false
			return result
		}

	}}))
})