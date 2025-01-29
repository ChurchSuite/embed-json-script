import Base from '../base'
import Group from './group'

export default class CSGroups extends Base {
	buildModelObject = (model) => new Group(model)

	/**
	 * Returns true if the given model should be visible, based on the filters.
	 */
	filterModel = function (model) {
		return (
			this.filterModel_Day(model) &&
			this.filterModel_Label(model) &&
			this.filterModel_Search(model) &&
			this.filterModel_Site(model)
		)
	}

	filterModel_Day = function (model) {
		let dayValue = this.filterValue('day')
		// no filter
		if (dayValue == null) return true
		// various days for group
		if (model.day == null) return true
		// legacy support - match on day string or int
		return dayValue.includes(model.day.format('dddd')) || dayValue.includes('' + model._original.day)
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
		let modelOptions = model.labels.map(label => label.value).flat();

		// get an array of labels that have been selected (ie, aren't null)
		const filteredLabels = Object.keys(this.label).filter(a => this.label[a] && this.label[a].length > 0)

		// if nothing is selected, return true
		if (filteredLabels.length == 0) return true;

		// perform the OR operation - if the model matches any of the selected label options
		let matchesLabels = []
		filteredLabels.forEach((options) => {
			matchesLabels.push(this.label[options].some((option) => modelOptions.includes(option)))
		})

		/**
		 * If the model matches at least one option in every label being filtered,
		 * (ie, the array is all true values) return true.
		 */
		return matchesLabels.every((option) => option)
	}

	filterModel_Search = function (model) {
		// no filter
		if (!this.searchQuery) return true

		// build a model search name with varying levels of date formats and event info
		let searchName = (
			model.name +
			' ' +
			(model.day ? model.day.format('dddd') : '') +
			' ' +
			model.location +
			' ' +
			model.category
		)
			.replace(/[\s\/\-\.]+/gi, ' ')
			.toLowerCase()
		return searchName.includes(this.searchQuery)
	}

	filterModel_Site = function (model) {
		// no filter selected
		if (this.site.length == 0) return true

		// all sites groups
		if (model.siteId == null) return true

		return this.site.includes(model.siteId)
	}

	async init() {
		// Alpine doesn't recognise a nice getter method, so use $watch to mirror models property to groups
		// do this before parent init() so that when we filterModels in it, it initialises this property
		this.$watch('models', value => (this.groups = value))

		await super.init()
	}

	constructor(options) {
		super()

		// Configuration & Options
		this.filterKeys = ['label', 'day', 'search', 'site']
		this.resourceModule = 'smallgroups'
		this.options = Object.assign(this.options, options) // options for fetching json - we want the merged events as we filter them client-side
		this.groups = []

		this.day = null // filterModels() day dropdown string

		this.label = {} // label id keyed object of values - populated when building objects
		this.labels = []

		this.site = [] // site array for filterModels()
		this.sites = [] // array of Site objects
	}
}