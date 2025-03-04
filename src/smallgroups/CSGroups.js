import Base from '../base'
import Configuration from './configuration';
import Group from './group'
import CustomField from '../components/customField'
import Label from '../components/label'

export default class CSGroups extends Base {

	/**
	 * Convert the Embed Configuration data into a nice Configuration model.
	 */
	buildConfiguration = function (data) {
		return new Configuration(data)
	}

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

		if (dayValue.constructor === Array) {
			return dayValue.map(f => f.toLowerCase()).includes(model.day.toLowerCase())
		} else {
			return dayValue.toLowerCase() == model.day.toLowerCase()
		}
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
		if (model.allSites) return true

		// compare as strings, so we handle any combination
		return this.site.map(s => s + '').includes(model.siteIds[0] + '')
	}

	async init() {
		// Alpine doesn't recognise a nice getter method, so use $watch to mirror models property to groups
		// do this before parent init() so that when we filterModels in it, it initialises this property
		this.$watch('models', value => (this.groups = value))

		await super.init()
	}

	/**
	 * An empty function that runs at the end of the init() method for each module.
	 * Overloaded to set up the resources
	 */
	postInit = function (response) {
		/**
		 * For efficiency, the Groups response sends over the labels and custom
		 * fields once on page 1, rather than on every Group.
		 */
		if (response.hasOwnProperty('labels')) {
			response.labels.forEach(label => this.labels.push(new Label(label)))
		}
		if (response.hasOwnProperty('custom_fields')) {
			response.custom_fields.forEach(field => this.customFields.push(new CustomField(field)))
		}
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

		this.customFields = []

		this.site = [] // site array for filterModels()
		this.sites = [] // array of Site objects
	}
}