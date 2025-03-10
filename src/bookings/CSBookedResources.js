import Base from '../base'
import BookedResource from './booked-resource'
import Configuration from './configuration';
import Resource from './resource'

export default class CSBookedResources extends Base {

	/**
	 * Convert the Embed Configuration data into a nice Configuration model.
	 */
	buildConfiguration = function (data) {
		return new Configuration(data)
	}

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

		return (
			resourceFilter.includes('' + model.resourceId)
		)
	}

	async init() {
		// Alpine doesn't recognise a nice getter method, so use $watch to mirror models property to bookedResources
		// do this before parent init() so that when we filterModels in it, it initialises this property
		this.$watch('models', value => (this.bookedResources = value))

		await super.init()
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