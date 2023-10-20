import Base from '../base'
import BookedResource from './booked-resource'
import Resource from './resource'

export default class CSBookedResources extends Base {
	buildModelObject = function (model) {
		// build and return the model object
		return new BookedResource(model)
	}

	/**
	 * Returns true if the given model should be visible, based on the filters.
	 */
	filterModel = function (model) {
		return this.filterModel_Resource(model) && this.filterModel_Site(model) && this.filterModel_Type(model)
	}

	filterModel_Resource = function (model) {
		let resourceFilter = this.filterValue('resource')
		// no filter
		if (resourceFilter == null) return true

		// if group has no resource, don't show
		if (!model.resource) return false

		// return on id or name for legacy support
		return (
			resourceFilter.includes('' + model._original.resource.id) ||
			resourceFilter.includes('' + model._original.resource.name)
		)
	}

	filterModel_Site = function (model) {
		// no filter
		if (this.site == null) return true

		// all sites groups
		if (model.siteId == null) return true

		return this.site.includes(model.siteId)
	}

	filterModel_Type = function (model) {
		let typeFilter = this.filterValue('type')
		// no filter
		if (typeFilter == null) return true

		// if group has no type, don't show
		if (!model.type) return false

		// return on id or name for legacy support
		return (
			typeFilter.includes('' + model._original.type.id) ||
			typeFilter.includes('' + model._original.type.name)
		)
	}

	async init() {
		await super.init()

		// Alpine doesn't recognise a nice getter method, so use $watch to mirror models property to bookedResources
		this.$watch('models', value => (this.bookedResources = value))
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
		if (response.hasOwnProperty('resources')) {
			response.resources.forEach(resource => this.resources.push(new Resource(resource)))
		}
	}

	constructor(options) {
		super()
		// Configuration & Options
		this.filterKeys = ['resource', 'type', 'site']
		this.resourceModule = 'bookings'
		this.options = Object.assign(this.options, options) // options for fetching json - we want the merged events as we filter them client-side
		this.bookedResources = []

		// Filter Data
		this.type = null
		this.types = []

		this.resource = null
		this.resources = []

		this.site = null // site string for filterModels()
		this.sites = [] // array of Site objects
	}
}