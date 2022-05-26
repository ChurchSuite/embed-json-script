export default class Base {

	/**
	 * To be overwritten by child classes.
	 * Builds/initialises a model object, using the given data object.
	 */
	buildModelObject = function (model) {
		return model
	}

	/**
	 * Takes a model (e.g. site, cluster, tag etc.) and adds an option id and name to a particular key array
	 */
	buildIdNameOption = function (key, model) {
		// see if we've got a legacyKey in play (category/categories!)
		let legacyKey = arguments.length > 2 ? arguments[2] : key+'s'

		// check the model exists
		if (model == null) return;

		let options = this[key+'Options']
		let optionIds = options.map(o => o.id)
		if (!optionIds.includes(model.id)) {
			// populate id and name options array
			this[key+'Options'].push({
				id: model.id,
				name: model.name,
			})
			// populate legacy key with just name options
			this[legacyKey].push(model.name)
		}
	}

	/**
	 * Returns true if the given model should be visible, based on the filters.
	 */
	filterModel = function (model) {
		return true
	}

	/**
	 * Returns true if we should be filtering models.
	 */
	filterModelsEnabled = function () {
		return true
	}

	/**
	 * Filters models based on the UI's filters.
	 */
	filterModels = function () {
		if (this.filterModelsEnabled()) {
			this.models = this.modelsAll.filter((model) => this.filterModel(model))
		}
		this.$dispatch('models-updated') // always do this!
	}

	/**
	 * Gets a filter value either as an array or null
	 * This also ignores 0 and '0' as values and returns null in place (for resetting selects)
	 */
	filterValue = function (key) {
		let parent = arguments.length > 1 ? arguments[1] : this
		let value = parent[key]
		let result = null

		if (Array.isArray(value)) {
			// it's an array - filter out empty values
			value = value.filter(v => (v !== 0 && v !== '0' && v !== null))
			// return the result if it's got length otherwise null
			result = value.length ? value : null
		} else if (value === null) {
			// always return null
			result = null
		} else if (typeof value === 'string' || value instanceof String) {
			// return the value as an array if it has length and isn't empty otherwise null
			result = value.length && value !== 0 && value !== '0' ? [value] : null
		}

		// if the result is null then reset the key reactively
		if (result == null) parent[key] = null

		// return the result
		return result;
	}

	/**
	 * Initialises the JSON feed asynchronously.
	 */
	async init() {
		dayjs.locale(CS.locale)

		this.$watch(this.filterKeys, () => this.filterModels())

		let response = await CS.fetchJSON(this.resourceModule, this.options)

		if (response.hasOwnProperty('configuration')) {
			// new style configuration data
			this.configuration = response.configuration
			this.mapConfiguration()

			response.data.forEach(model => {
				this.modelsAll.push(this.buildModelObject(model))
			})
		} else {
			// old style flat array
			window.test = this
			response.forEach(model => {
				this.modelsAll.push(this.buildModelObject(model))
			})
		}

		this.postInit()

		this.$nextTick(() => this.filterModels())
	}

	/**
	 * This method maps the configuration settings over to json script options
	 */
	mapConfiguration = function () {}

	/**
	 * An empty function that runs at the end of the init() method for each module.
	 * Overload if you need to run code at the end of initialisation.
	 */
	postInit = function () {}

	constructor() {
		// Configuration & Options
		this.configuration = {} // the embed configuration
		this.filterKeys = [] // the names of the filters for this feed
		this.options = {} // options for fetching json
		this.resourceModule = '' // the module we're in

		// Model Data
		this.models = [] // our filtered model objects
		this.modelsAll = [] // all of our model objects
	}
}