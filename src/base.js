import Brand from './components/brand';
import Label from './components/label'
import Site from './components/site'

export default class Base {
	/**
	 * To be overwritten by child classes.
	 * Builds/initialises a model object, using the given data object.
	 */
	buildModelObject = function (model) {
		return model
	}

	/**
	 * Takes a model property object (e.g. site, cluster, tag etc.) and adds it to the
	 * {key}Options and {key}s arrays if not already there, to use for dropdowns.
	 * @param {string} key - The JSON key to look at (e.g. category)
	 * @param {Object} property - The property to add (e.g. an event site) with id and name properties
	 * @param {string} [legacyKey=null] - An alternative legacy key, if not the key with an 's' (e.g. 'categories')
	 */
	buildIdNameOption = function (key, property, legacyKey = null) {
		// check the property is set
		if (property == null) return

		// if legacy key provided use it, otherwise pluralise key
		legacyKey = legacyKey ?? key + 's'

		let options = this[key + 'Options']
		let optionIds = options.map(o => o.id)
		if (!optionIds.includes(property.id)) {
			// populate id and name options array
			this[key + 'Options'].push({
				id: property.id,
				name: property.name,
			})
			// populate legacy key with just name options
			this[legacyKey].push(property.name)
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
		this.loading = true
		if (this.filterModelsEnabled()) {
			// first update the searchQuery so we don't do it for every model in this.filterModel() - replace date separators with spaces
			let q = this.search || ''
			this.searchQuery = q.length ? q.replace(/[\s\/\-\.]+/gi, ' ').toLowerCase() : null

			this.models = this.modelsAll.filter(model => this.filterModel(model))
		}
		this.$dispatch('models-updated') // always do this!
		this.loading = false
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
			value = value.filter(v => v !== 0 && v !== '0' && v !== null && v !== '')
			// return the string cast array result if it's got length otherwise null
			result = value.length ? value.map(v => '' + v) : null
		} else if (value === null) {
			// always return null
			result = null
		} else if (typeof value === 'string' || value instanceof String) {
			// return the value as an array if it has length and isn't empty otherwise null
			result = value.length && value !== 0 && value !== '0' ? [value.toString()] : null
		}

		// if the result is null then reset the key reactively
		if (result == null) parent[key] = null

		// return the result
		return result
	}

	/**
	 * Initialises the JSON feed asynchronously.
	 */
	async init() {
		this.$watch(this.filterKeys.join(', '), () => this.filterModels())

		let response = await CS.fetchJSON(this.resourceModule, Object.assign({}, this.options))

		// set the default image to the brand emblem
		if (response.hasOwnProperty('brand')) {
			this.emblemImage = response.brand.emblem[512].url
			this.brand = new Brand(response.brand)
		}

		/** 
		 * For efficiency, the Organisation response sends over the labels once
		 * on page 1, rather than on every Organisation.
		 */
		if (response.hasOwnProperty('labels')) {
			response.labels.forEach(label => this.labels.push(new Label(label)))
		}

		if (response.hasOwnProperty('configuration')) {
			// new style configuration data
			this.configuration = response.configuration
			this.mapConfiguration()

			response.data.forEach(model => {
				this.modelsAll.push(this.buildModelObject(model))
			})
		} else {
			// old style flat array
			response.forEach(model => {
				this.modelsAll.push(this.buildModelObject(model))
			})
		}

		/** 
		 * For efficiency, the Organisation response sends over the sites once
		 * on page 1, rather than on every Organisation.
		 */
		if (response.hasOwnProperty('sites')) {
			response.sites.forEach(site => this.sites.push(new Site(site)))
		}

		this.postInit()

		this.$nextTick(() => this.filterModels())

		// go and fetch the rest of the paginated data
		if (response.hasOwnProperty('pagination')) {
			// don't do anything if we already have all the data
			if (response.pagination.num_results <= response.pagination.results_per_page) return

			
				this.$nextTick(() => {
					let promises = []
					for (let page = 2; page <= response.pagination.totalPages; page++) {
						let options = Object.assign({}, this.options)
						options.page = page
						promises.push(CS.fetchJSON(this.resourceModule, options)
							.then(response => response.data.forEach(model => {
								this.modelsAll.push(this.buildModelObject(model))
							})))
					}

					Promise.allSettled(promises).then(() => this.filterModels())
				})
			
		}
		
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
		// set the locale before init(), so it runs before we generate days of week
		dayjs.locale(CS.locale)

		// Configuration & Options
		this.brand = {} // the brand for this configuration
		this.configuration = {} // the embed configuration
		this.filterKeys = [] // the names of the filters for this feed
		this.options = {} // options for fetching json
		this.resourceModule = '' // the module we're in
		this.loading = true // boolean to control loading pulses and spinners

		// Model Data
		this.models = [] // our filtered model objects
		this.modelsAll = [] // all of our model objects

		this.search = null // search terms
		this.searchQuery = null // search query string
	}
}
