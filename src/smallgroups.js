import "./cs";
import Group from "./smallgroups/group";

document.addEventListener('alpine:init', () => {
	Alpine.data('CSGroups', (options = {}) => ({...CSJsonFeed(options), ...{
		// Configuration & Options
		filterKeys: ['day', 'label', 'site'],
		resourceModule: 'smallgroups',

		// Filter Data
		day: '', // filterModels() day dropdown string
		days: [], // array to contain days of the week for dropdown
		label: '', // label string for filterModels()
		labels: [], // labels array for label dropdown
		labelsMatch: 'all', // if group needs to match all labels in multiselect - other option is 'any'
		site: '', // site string for filterModels()
		sites: [], // sites array for site dropdown

		buildModelObject(model) {
			// capture unique labels and sites for dropdowns, then sort them
			if (model.labels != null) {
				model.labels.forEach(label => {
					if (!this.labels.includes(label.name)) this.labels.push(label.name);
				});
			}
			if (model.site != null && !this.sites.includes(model.site.name)) this.sites.push(model.site.name);
			this.labels.sort();
			this.sites.sort();

			// push formatted data to the models array
			model.labelsMatch = this.labelsMatch; // pass this config value over to the model for ease of access

			return new Group(model);
		},

		/**
		 * Builds a formatted array of groups data
		 */
		postInit() {
			// load in array of days for day filter dropdown
			this.days = this.daysOfWeek();
			this.labelsMatch = this.configuration.filterByLabelMatch;
		},

		/**
		 * Returns true if the given model should be visible, based on the filters.
		 */
		filterModel(model) {
			return model.dayMatches(this.day)
				&& model.labelMatches(this.label)
				&& model.siteMatches(this.site);
		}

	}}))
});