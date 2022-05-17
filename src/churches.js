import "./cs";
import Church from "./churches/church";

document.addEventListener('alpine:init', () => {
	Alpine.data('CSChurches', (options = {}) => ({...CSJsonFeed(options), ...{
		// Configuration & Options
		filterKeys: ['site'],
		resourceModule: 'churches',

		// Filter Data
		site: '', // site dropdown value
		sites: [], // array of possible site values

		buildModelObject(model) {
			// capture unique and sites
			if (model.site != null && !this.sites.includes(model.site.name)) this.sites.push(model.site.name);
			this.sites.sort();

			// build and return the model object
			return new Church(model);
		},

		/**
		 * Returns true if the given model should be visible, based on the filters.
		 */
		filterModel(model) {
			return model.siteMatches(this.site);
		}

	}}))
});