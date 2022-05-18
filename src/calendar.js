import "./cs"
import Event from "./calendar/event"

document.addEventListener('alpine:init', () => {
	Alpine.data('CSEvents', (options = {}) => ({...CS(options), ...{
		// Configuration & Options
		filterKeys: ['category', 'search', 'site'],
		options: {includeMerged: true}, // options for fetching json - we want the merged events as we filter them client-side
		resourceModule: 'calendar',

		// Model Data
		events() { return this.models },
		modelsMerged: [], // array to contain the merged events, depending on merge strategy - first in sequence, etc

		// Filter Data
		categories: [], // a compiled array of all event categories
		category: '', // linked to selected option from dropdown for comparison with the event category
		search: '', // search terms
		searchQuery: '', // search query string
		site: '', // site string for filterModels()
		sites: [], // sites array for site dropdown

		buildModelObject(model) {
			// capture unique categories and sites
			if (model.category != null && !this.categories.includes(model.category.name)) this.categories.push(model.category.name)
			if (model.site != null && !this.sites.includes(model.site.name)) this.sites.push(model.site.name)

			let event = new Event(model)

			// build an array of events to show when merged together (first in sequence etc)
			if (model.merged_by_strategy == 0) this.modelsMerged.push(event)

			return event
		},

		/**
		 * Returns true if we should be filtering models.
		 */
		filterModelsEnabled() {
			if (!this.search.length && !this.category.length && !this.site.length) {
				// if we're not filtering by anything, only show merged events (following merge strategy)
				this.models = this.modelsMerged
				return false
			} else {
				// first update the searchQuery so we don't do it for every model in this.filterModel() - replace date separators with spaces
				this.searchQuery = this.search.replace(/[\s\/\-\.]+/gi, ' ').toLowerCase()
				return true
			}
		},

		/**
		 * Returns true if the given model should be visible, based on the filters.
		 */
		filterModel(model) {
			return this.filterModel_Category(model)
				&& this.filterModel_Search(model)
				&& this.filterModel_Site(model)
		},

		filterModel_Category(model) {
			return !this.category.length || model.category == this.category;
		},

		filterModel_Search(model) {
			if (!this.searchQuery.length) return true;

			// build a model search name with varying levels of date formats and event info
			let searchName = (
				model.name
				+ ' ' + model.start.format('M D YY')
				+ ' ' + model.start.format('D M YY')
				+ ' ' + model.start.format('MM DD YY')
				+ ' ' + model.start.format('DD MM YY')
				+ ' ' + model.start.format('MMM DD YY')
				+ ' ' + model.start.format('DD MMM YY')
				+ ' ' + model.start.format('MMMM DD YY')
				+ ' ' + model.start.format('DD MMMM YY')
				+ ' ' + model.start.format('M D YYYY')
				+ ' ' + model.start.format('D M YYYY')
				+ ' ' + model.start.format('MM DD YYYY')
				+ ' ' + model.start.format('DD MM YYYY')
				+ ' ' + model.start.format('MMM DD YYYY')
				+ ' ' + model.start.format('DD MMM YYYY')
				+ ' ' + model.start.format('MMMM DD YYYY')
				+ ' ' + model.start.format('DD MMMM YYYY')
				+ ' ' + model.location
				+ ' ' + model.category
			).replace(/[\s\/\-\.]+/gi, ' ').toLowerCase();
			return searchName.includes(this.searchQuery);
		},

		filterModel_Site(model) {
			let sitesValue = Array.isArray(this.site) ? this.site : (this.site ? [this.site] : []);
			return model.site == null || !sitesValue.length || sitesValue.includes(model.site);
		}

	}}))
})