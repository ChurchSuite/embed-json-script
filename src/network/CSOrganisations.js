import Base from '../base'
import Organisation from './organisation'

export default class CSOrganisations extends Base {
	buildModelObject = (model) => new Organisation(model)

	/**
	 * Returns true if the given model should be visible, based on the filters.
	 */
	filterModel = function (model) {
		return this.filterModel_Label(model) && this.filterModel_Site(model)
	}

	filterModel_Label = function (model) {
		// get a flattened array of label options selected in the filter
		let labelOptions = Object.values(this.label).flat().filter(a => a)

		// if nothing is selected, return true
		if (labelOptions.length == 0) return true;

		// get a flattened array of label options the model has
		let modelOptions = model.labels.map(label => label.value).flat();

		// if labelOptions has any overlap with modelOptions, return true
		return labelOptions.some((option) => modelOptions.includes(option))
	}

	filterModel_Site = function (model) {
		// no filter selected
		if (this.site.length == 0) return true

		// all sites groups
		if (model.siteId == null) return true

		return this.site.includes(model.siteId)
	}

	async init() {
		// Alpine doesn't recognise a nice getter method, so use $watch to mirror models property to organisations
		// do this before parent init() so that when we filterModels in it, it initialises this property
		this.$watch('models', value => (this.organisations = value))

		await super.init()
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

		this.site = [] // site array for filterModels()
		this.sites = [] // array of Site objects
	}
}