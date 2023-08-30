import Base from '../base'
import Organisation from './organisation'

export default class CSOrganisations extends Base {
	buildModelObject = function (model) {

		// build and return the model object
		return new Organisation(model)
	}

	/**
	 * Returns true if the given model should be visible, based on the filters.
	 */
	filterModel = function (model) {
		return this.filterModel_Label(model) && this.filterModel_Site(model)
	}

	filterModel_Label = function (model) {
		// get a flattened array of label options the model has
		let modelOptions = model.labels.map(label => label.value).flat();

		// get a flattened array of label options selected in the filter
		let labelOptions = Object.values(this.label).flat().filter(a => a)

		// if nothing is selected, return true
		if (labelOptions.length == 0) return true;

		// if labelOptions has any overlap with modelOptions, return true
		return labelOptions.some((option) => modelOptions.includes(option))
	}

	filterModel_Site = function (model) {
		// no filter
		if (this.site == null) return true

		// all sites groups
		if (model.siteId == null) return true

		return this.site.includes(model.siteId)
	}

	async init() {
		await super.init()

		// Alpine doesn't recognise a nice getter method, so use $watch to mirror models property to organisations
		this.$watch('models', value => (this.organisations = value))
	}

	constructor(options) {
		super()

		// Configuration & Options
		this.filterKeys = ['label', 'search', 'site']
		this.resourceModule = 'network'
		this.options = Object.assign(this.options, options) // options for fetching json - we want the merged events as we filter them client-side
		this.organisations = []

		// Filter Data
		this.label = {} // label id keyed object of values - populated when building objects
		this.labels = []

		this.site = null // site string for filterModels()
		this.sites = [] // array of Site objects
	}
}