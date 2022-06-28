import Base from '../base'
import Church from './church'
import { buildLabels } from '../components/labels'

export default class CSChurches extends Base {
	buildModelObject = function (model) {
		// capture unique sites
		this.buildIdNameOption('site', model.site)
		this.sites.sort()

		// loop the labels and capture them
		this.buildLabels()

		// build and return the model object
		return new Church(model)
	}

	/**
	 * This method maps the configuration settings over to json script options
	 */
	mapConfiguration = function () {
		// map across any configuration keys and data
		if (this.configuration.hasOwnProperty('id')) {
			let configurationMap = {
				showFilterLabels: 'show_labels',
				showFilterSites: 'show_sites',
			}

			Object.keys(configurationMap).forEach(o => {
				if (this.configuration.hasOwnProperty(o)) {
					// set the options key
					this.options[configurationMap[o]] = this.configuration[o]
				}
			})
		}
	}

	/**
	 * Returns true if we should be filtering models.
	 */
	filterModelsEnabled = function () {
		// first update the searchQuery so we don't do it for every model in this.filterModel() - replace date separators with spaces
		let q = this.search || ''
		this.searchQuery = q.length ? q.replace(/[\s\/\-\.]+/gi, ' ').toLowerCase() : null
		return true
	}

	/**
	 * Returns true if the given model should be visible, based on the filters.
	 */
	filterModel = function (model) {
		return this.filterModel_Label(model) && this.filterModel_Site(model)
	}

	filterModel_Label = function (model) {
		// need to match them all so set up an array of matches
		let result = true
		Object.values(this.label).forEach(v => {
			let labelFilter = this.filterValue('value', v)
			if (!labelFilter) return

			// set up a bool for if the label had been found
			let labelFound = false
			model._original.labels.forEach(label => {
				if (label.id == v.id) {
					// if this is the right label mark as found
					labelFound = true
					// now check for a match - update result if false
					let filterResult = false
					labelFilter.forEach(filter => {
						// if we find at least one match then set this filterResult to true
						if (label.value.includes(filter)) filterResult = true
					})

					if (!filterResult) result = false
				}
			})
			// if this group doesn't have this label then update result
			if (!labelFound) result = false
		})

		return result
	}

	filterModel_Site = function (model) {
		let siteFilter = this.filterValue('site')
		// no filter
		if (siteFilter == null) return true
		// all sites groups
		if (model._original.site == null) return true
		// return on id or name for legacy support
		return (
			siteFilter.includes('' + model._original.site.id) ||
			siteFilter.includes('' + model._original.site.name)
		)
	}

	async init() {
		await super.init()

		// Alpine doesn't recognise a nice getter method, so use $watch to mirror models property to churches
		this.$watch('models', value => (this.churches = value))
	}

	constructor(options) {
		super()

		// Configuration & Options
		this.filterKeys = ['label', 'search', 'site']
		this.resourceModule = 'churches'
		this.options = Object.assign(this.options, options) // options for fetching json - we want the merged events as we filter them client-side
		this.churches = []

		// Filter Data
		this.label = {} // label id keyed object of values - populated when building objects
		this.labels = []

		this.site = null // site string for filterModels()
		this.siteOptions = [] // id and name site options
		this.sites = [] // @deprecated sites name array

		// shared function between label-using classes
		this.buildLabels = buildLabels
	}
}