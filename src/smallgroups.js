import "./cs";
import Group from "./smallgroups/group";

document.addEventListener('alpine:init', () => {
	Alpine.data('CSGroups', (options = {}) => ({...CS(options), ...{
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
			// pull across the tagsMatch from the configuration
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
			return this.filterModel_Cluster(model)
				&& this.filterModel_Day(model)
				&& this.filterModel_Label(model)
				&& this.filterModel_Search(model)
				&& this.filterModel_Site(model)
				&& this.filterModel_Tag(model)
		},

		filterModel_Cluster(model) {
			let clustersValue = Array.isArray(this.cluster) ? this.cluster : (this.cluster ? [this.cluster] : []);
			return !clustersValue.length || clustersValue.includes(model.cluster);
		},

		filterModel_Day(model) {
			let dayValue = Array.isArray(this.day) ? this.day : (!this.day ? [] : [this.day]);
			return model.day == null || !dayValue.length || dayValue.includes(model.day.format('dddd'));
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

		filterModel_Search(model) {
			if (!this.searchQuery.length) return true;

			// build a model search name with varying levels of date formats and event info
			let searchName = (
				model.name
				+ ' ' + (model.day ? model.day.format('dddd') : '')
				+ ' ' + model.location
				+ ' ' + model.category
			).replace(/[\s\/\-\.]+/gi, ' ').toLowerCase();
			return searchName.includes(this.searchQuery);
		},

		filterModel_Site(model) {
			let sitesValue = Array.isArray(this.site) ? this.site : (this.site ? [this.site] : []);
			return model.site == null || !sitesValue.length || sitesValue.includes(model.site);
		},

		filterModel_Tag(model) {
			let tagValue = Array.isArray(this.tag) ? this.tag : (this.tag ? [this.tag] : []);
			let modelTags = Array.isArray(model._original.tags) ? model._original.tags.map(tag => tag.name) : [];
			return CSMultiSelect().matches(modelTags, tagValue, this.tagsMatch);
		}

	}}))
})