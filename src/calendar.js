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
		categories: [], // @deprecated a compiled array of all event categories
		category: null, // linked to selected option from dropdown for comparison with the event category
		categoryOptions: [],

		search: null, // search terms
		searchQuery: null, // search query string

		site: null, // @deprecated site string for filterModels()
		siteOptions: [],
		sites: [], // sites array for site dropdown

		buildModelObject(model) {
			// capture unique categories and sites
			this.buildIdNameOption('category', model.category, 'categories')
			this.buildIdNameOption('site', model.site)

			let event = new Event(model)

			// build an array of events to show when merged together (first in sequence etc)
			if (model.merged_by_strategy == 0) this.modelsMerged.push(event)

			return event
		},

		/**
		 * Returns true if we should be filtering models.
		 */
		filterModelsEnabled() {
			let searchFilter = this.filterValue('search')
			let categoryFilter = this.filterValue('category')
			let siteFilter = this.filterValue('site')

			if (!(this.search || '').length && !categoryFilter && !siteFilter) {
				// if we're not filtering by anything, only show merged events (following merge strategy)
				this.models = this.modelsMerged
				return false
			} else {
				// first update the searchQuery so we don't do it for every model in this.filterModel() - replace date separators with spaces
				let q = (this.search || '')
				this.searchQuery = q.length ? q.replace(/[\s\/\-\.]+/gi, ' ').toLowerCase() : null
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
			let categoryFilter = this.filterValue('category')
			// no filter
			if (categoryFilter == null) return true
			// return on id or name for legacy support
			return categoryFilter.includes(''+model._original.category.id)
				|| categoryFilter.includes(model._original.category.name);
		},

		filterModel_Search(model) {
			if (!this.searchQuery) return true;

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
			let siteFilter = this.filterValue('site')
			// no filter
			if (siteFilter == null) return true
			// all sites event
			if (model._original.site == null) return true
			// return on id or name for legacy support
			return siteFilter.includes(''+model._original.site.id)
				|| siteFilter.includes(model._original.site.name)
		}

	}}))
})