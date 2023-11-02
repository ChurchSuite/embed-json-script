import Base from '../base'
import BookedResource from './booked-resource'
import Resource from './resource'

export default class CSBookedResources extends Base {
	buildModelObject = function (model) {
		// build and return the model object
		return new BookedResource(model)
	}

	/**
	 * Returns an array of filtered resources which takes the resource filter into account
	 */
	filteredResources = function() {
		return this.resources.filter(resource => {
			return this.filterValue('resource') == null || this.filterValue('resource').includes('' + resource.id)
		})
	}

	/**
	 * Returns true if the given model should be visible, based on the filters.
	 */
	filterModel = function (model) {
		return this.filterModel_Resource(model)
	}

	filterModel_Resource = function (model) {
		let resourceFilter = this.filterValue('resource')
		// no filter
		if (resourceFilter == null) return true

		// if group has no resource, don't show
		if (!model.resourceId) return false

		// return on id or name for legacy support
		return (
			resourceFilter.includes('' + model.resourceId)
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
		this.filterKeys = ['resource']
		this.resourceModule = 'bookings'
		this.options = Object.assign(this.options, options) // options for fetching json - we want the merged events as we filter them client-side
		this.bookedResources = []

		// Filter Data
		this.resource = null
		this.resources = []
	}
}