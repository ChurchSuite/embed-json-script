import "./cs";
import Group from "./smallgroups/group";

document.addEventListener('alpine:init', () => {
	Alpine.data('CSGroups', (options = {}) => ({...CSJsonFeed(options), ...{
		// Configuration & Options
		filterKeys: ['day', 'tag', 'site', 'label', 'cluster'],
		resourceModule: 'smallgroups',
		groups() {
			// backwards compatibility
			return this.models
		},

		// Filter Data
		cluster: '',
		clusters: [],
		day: '', // filterModels() day dropdown string
		days: [], // array to contain days of the week for dropdown
		label: {},
		labels: [],
		labelsProcessed: [],
		search: '',
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

			// loop the labels and create filters for them
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
			this.tagsMatch = this.configuration.filterByLabelMatch
		},

		/**
		 * Returns true if the given model should be visible, based on the filters.
		 */
		filterModel(model) {
			return model.dayMatches(this.day)
				&& model.tagMatches(this.tag)
				&& model.siteMatches(this.site)
				&& model.labelMatches(this.label)
		}

	}}))
})