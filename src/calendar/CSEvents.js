import Base from '../base'
import Event from './event'
import Category from './category'

export default class CSEvents extends Base {
	buildModelObject = function (model) {
		let event = new Event(model)

		if (model.merge_identifier == null || !this.mergeIdentifiers.includes(model.merge_identifier)) {
			// event should not be hidden
			this.modelsMerged.push(event)
			// log the merge identifier if necessary for next time around
			if (model.merge_identifier !== null) this.mergeIdentifiers.push(model.merge_identifier)
		}

		return event
	}

	/**
	 * Returns true if we should be filtering models.
	 */
	filterModelsEnabled = function () {
		let categoryFilter = this.filterValue('category')
		let siteFilter = this.filterValue('site')

		if (!(this.search || '').length && !categoryFilter && !siteFilter) {
			// if we're not filtering by anything, only show merged events (following merge strategy)
			this.models = this.modelsMerged
			return false
		}

		return true
	}

	/**
	 * Returns true if the given model should be visible, based on the filters.
	 */
	filterModel = function (model) {
		return (
			this.filterModel_Category(model) &&
			this.filterModel_Search(model) &&
			this.filterModel_Site(model)
		)
	}

	filterModel_Category = function (model) {
		let categoryFilter = this.filterValue('category')
		// no filter
		if (categoryFilter == null) return true
		// return on id
		return categoryFilter.includes('' + model.categoryId)
	}

	filterModel_Search = function (model) {
		if (!this.searchQuery) return true

		// build a model search name with varying levels of date formats and event info
		let searchName = (
			model.name +
			' ' +
			model.start.format('M D YY ') +
			model.start.format('D M YY ') +
			model.start.format('MM DD YY ') +
			model.start.format('DD MM YY ') +
			model.start.format('MMM DD YY ') +
			model.start.format('DD MMM YY ') +
			model.start.format('MMMM DD YY ') +
			model.start.format('DD MMMM YY ') +
			model.start.format('M D YYYY ') +
			model.start.format('D M YYYY ') +
			model.start.format('MM DD YYYY ') +
			model.start.format('DD MM YYYY ') +
			model.start.format('MMM DD YYYY ') +
			model.start.format('DD MMM YYYY ') +
			model.start.format('MMMM DD YYYY ') +
			model.start.format('DD MMMM YYYY ') +
			model.location +
			' ' +
			model.category
		)
			.replace(/[\s\/\-\.]+/gi, ' ')
			.toLowerCase()
		return searchName.includes(this.searchQuery)
	}

	filterModel_Site = function (model) {
		let siteFilter = this.filterValue('site')
		// no filter
		if (siteFilter === null) return true

		// all sites event
		if (model.siteIds == null) return true
		if (model.siteIds.length == 0) return true

		// check for intersection of the two arrays
		return siteFilter.flat().some(siteId => model.siteIds.flat().includes(siteId))
	}

	async init() {
		// Alpine doesn't recognise a nice getter method, so use $watch to mirror models property to events
		// do this before parent init() so that when we filterModels in it, it initialises this property
		this.$watch('models', value => (this.events = value))

		await super.init()
	}

	/**
	 * An empty function that runs at the end of the init() method for each module.
	 * Overloaded to set up the resources
	 */
	postInit = function (response) {
		/**
		 * For efficiency, the BookedResources response sends over the resources once
		 * on page 1, rather than on every BookedResource.
		 */
		if (response.hasOwnProperty('categories')) {
			response.categories.forEach(category => this.categories.push(new Category(category)))
		}
	}

	/**
	 * Sets up the x-data for CSEvents
	 */
	constructor(options) {
		super()

		// Configuration & Options
		this.filterKeys = ['category', 'search', 'site']
		this.resourceModule = 'calendar'
		this.options = Object.assign(this.options, options) // options for fetching json - we want the merged events as we filter them client-side
		this.events = []

		// Model Data
		this.mergeIdentifiers = [] // array of 'used' identifiers for this batch of events
		this.modelsMerged = [] // array to contain the merged events, depending on merge strategy - first in sequence, etc

		this.categories = []
		this.category = []

		this.site = []
		this.sites = []
	}
}
