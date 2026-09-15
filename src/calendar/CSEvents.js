import Base from '../base'
import Event from './event'
import Category from './category'
import Configuration from './configuration';
import Label from '../components/label'

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
	 * Convert the Embed Configuration data into a nice Configuration model.
	 */
	buildConfiguration = function (data) {
		return new Configuration(data)
	}

	/**
	 * Returns true if we should be filtering models.
	 */
	filterModelsEnabled = function () {
		let categoryFilter = this.filterValue('category')
		let siteFilter = this.filterValue('site')
		const filteredLabels = Object.keys(this.label).filter(a => this.label[a] && this.label[a].length > 0)

		if (!(this.search || '').length && !categoryFilter && !siteFilter && filteredLabels.length === 0) {
			// if we're not filtering by anything, only show merged events (following merge strategy)
			if (this.configuration.numOfEvents) {
				this.models = this.modelsMerged.slice(0, this.configuration.numOfEvents)
			} else {
				this.models = this.modelsMerged
			}
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
			this.filterModel_Label(model) &&
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

	/**
	 * For each label, check that the model has any of the selected options (to
	 * support multiselect fields), and that that is true for all selected labels.
	 * 
	 * IE, OR between options for a single label, and then AND multiple labels
	 */
	filterModel_Label = function (model) {
		// get a flattened array of label options the model has - they're UUIDs
		// so we can just check if our selected options are in the array
		let modelOptions = model.labels.map(label => label.options).flat();

		// get an array of labels that have been selected (ie, aren't null)
		const filteredLabels = Object.keys(this.label).filter(a => this.label[a] && this.label[a].length > 0)

		// if nothing is selected, return true
		if (filteredLabels.length == 0) return true;

		// perform the OR operation - if the model matches any of the selected label options
		let matchesLabels = []
		filteredLabels.forEach((options) => {
			matchesLabels.push(this.label[options].some((option) => modelOptions.includes(option)))
		})

		/**		 * If the model matches at least one option in every label being filtered,
		 * (ie, the array is all true values) return true.
		 */
		return matchesLabels.every((option) => option)
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

		if (model.allSites) return true

		// check for intersection of the two arrays
		return siteFilter.flat().some(siteId => model.siteIds.flat().map(v => '' + v).includes(siteId))
	}

	/**
	 * Filters models based on the UI's filters.
	 */
	filterModels = function () {
		this.loading = true
		if (this.filterModelsEnabled()) {
			/**
			 * Filtering by a search query should ignore the merge strategy and show all matching results.
			 * Filtering by Category or Site should continue to respect the merge strategy.
			 */
			if ((this.search || '').length > 0) {
				// first update the searchQuery so we don't do it for every model in this.filterModel() - replace date separators with spaces
				let q = this.search || ''
				this.searchQuery = q.length ? q.replace(/[\s\/\-\.]+/gi, ' ').toLowerCase() : null
				/**
				 * Filtering by a search query should ignore the merge strategy and show all matching results.
				 * Ensure we display all filtered models rather than only filtering the merged models.
				 */
				this.models = this.modelsAll.filter(model => this.filterModel(model))
			} else {
				/**
				 * Filtering by Category or Site should continue to respect the merge strategy.
				 * Ensure we only filter the merged models.
				 */
				this.models = this.modelsMerged.filter(model => this.filterModel(model))
			}
		}
		this.$dispatch('models-updated') // always do this!
		this.loading = false
	}

	async init() {
		// Alpine doesn't recognise a nice getter method, so use $watch to mirror models property to events
		// do this before parent init() so that when we filterModels in it, it initialises this property
		this.$watch('models', value => (this.events = value))

		await super.init()
	}

	/**
	 * An empty function that runs at the end of the init() method for each module.
	 * Overloaded to set up the categories and labels
	 */
	postInit = function (response) {
		/**
		 * For efficiency, the Events response sends over the categories and labels
		 * once on page 1, rather than on every page.
		 */
		if (response.hasOwnProperty('categories')) {
			response.categories.forEach(category => this.categories.push(new Category(category)))
		}
		if (response.hasOwnProperty('labels')) {
			response.labels.forEach(label => this.labels.push(new Label(label)))
		}
	}

	/**
	 * Sets up the x-data for CSEvents
	 */
	constructor(options) {
		super()

		// Configuration & Options
		this.filterKeys = ['category', 'label', 'search', 'site']
		this.resourceModule = 'calendar'
		this.options = Object.assign(this.options, options) // options for fetching json - we want the merged events as we filter them client-side
		this.events = []

		// Model Data
		this.mergeIdentifiers = [] // array of 'used' identifiers for this batch of events
		this.modelsMerged = [] // array to contain the merged events, depending on merge strategy - first in sequence, etc

		this.categories = []
		this.category = []

		this.label = {} // label id keyed object of values - populated when building objects
		this.labels = []

		this.site = []
		this.sites = []
	}
}
