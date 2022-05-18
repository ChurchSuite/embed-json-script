import "./cs";
import Group from "./smallgroups/group";

document.addEventListener('alpine:init', () => {
	Alpine.data('CSGroups', (options = {}) => ({...CSJsonFeed(options), ...{
		// Configuration & Options
		filterKeys: ['day', 'tag', 'search', 'site', 'label', 'cluster'],
		resourceModule: 'smallgroups',
		groups() { return this.models },
		// Filter Data
		cluster: '',
		clusters: [],
		day: '', // filterModels() day dropdown string
		days: [], // array to contain days of the week for dropdown
		label: {},
		labels: [],
		labelsProcessed: [],
		search: '',
		searchQuery: '',
		site: '', // site string for filterModels()
		sites: [], // sites array for site dropdown
		tag: '', // tag string for filterModels()
		tags: [], // tags array for tag dropdown
		tagsMatch: 'all', // if group needs to match all tags in multiselect - other option is 'any'

		buildModelObject(model) {
			// capture unique tags, clusters and sites for dropdowns, then sort them
			if (model.tags != null) {
				model.tags.forEach(tag => {
					if (!this.tags.includes(tag.name)) this.tags.push(tag.name)
				})
			}
			if (model.cluster != null && !this.clusters.includes(model.cluster.name)) this.clusters.push(model.cluster.name)
			if (model.site != null && !this.sites.includes(model.site.name)) this.sites.push(model.site.name)
			this.tags.sort()
			this.sites.sort()

			// push formatted data to the models array
			model.tagsMatch = this.tagsMatch // pass this config value over to the model for ease of access

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

			return new Group(model)
		},

		/**
		 * Builds a formatted array of groups data
		 */
		postInit() {
			// load in array of days for day filter dropdown
			this.days = this.daysOfWeek()
			this.tagsMatch = this.configuration.filterByTagMatch
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
			return model._matchCluster(this.cluster)
				&& model._matchDay(this.day)
				&& model._matchLabel(this.label)
				&& model._matchSearch(this.searchQuery)
				&& model._matchSite(this.site)
				&& model._matchTag(this.tag)
		}

	}}))
})