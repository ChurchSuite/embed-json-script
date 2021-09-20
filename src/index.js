var dayjs = require('dayjs');

// require internationalisation packs
var localizedFormat = require('dayjs/plugin/localizedFormat');
dayjs.extend(localizedFormat);
require('dayjs/locale/da')
require('dayjs/locale/de')
require('dayjs/locale/es');
require('dayjs/locale/fr');
require('dayjs/locale/it');
require('dayjs/locale/nl');
require('dayjs/locale/pl');
require('dayjs/locale/se');
require('dayjs/locale/sk');

// require isoweek to create dayjs objects for days
var isoWeek = require('dayjs/plugin/isoWeek');
dayjs.extend(isoWeek);

window.dayjs = dayjs;

document.addEventListener('alpine:init', () => {
	Alpine.data('CSEvents', (options = {}) => ({
		allEvents: [], // array to contain unfiltered events
		categories: [], // a compiled array of all event categories
		category: '', // linked to selected option from dropdown for comparison with the event category
		events: [], // array to contain filtered events
		featuredEvents: [], // array to contain featured events
		name: '', // name dropdown value
		names: [], // array of possible name values
		search: '', // search terms
		site: '', // site dropdown value
		sites: [], // array of possible site values
		
		async init() {
			dayjs.locale(CS.locale);

			this.$watch(['category', 'search', 'site'], () => this.filterEvents());

			let events = (await CS.fetchJSON('events', options)).filter(event => event.signup_options.public.featured == '1');
			
			events.forEach(event => {
				// capture unique categories and sites
				if (event.category != null && !this.categories.includes(event.category.name)) this.categories.push(event.category.name);
				if (event.site != null && !this.sites.includes(event.site.name)) this.sites.push(event.site.name);

				let eventData = {
					_original: event,
					allDay: event.datetime_start.slice(-8) == '00:00:00' && event.datetime_end.slice(-8) == '23:59:59',
					brandEmblem: event.brand.emblem,
					category: event.category != null ? event.category.name : null,
					description: CS.stringToHTML(event.description),
					end: dayjs(event.datetime_end),
					image: event.images.constructor === Object ? event.images.md.url : event.brand.emblem,
					link: event.signup_options.signup_enabled == 1 ? event.signup_options.tickets.url : '',
					location: event.location.name,
					name: event.name,
					online: event.location.type == 'online',
					postcode: event.location.address,
					site: event.site != null ? event.site.name : null,
					start: dayjs(event.datetime_start),
				}
				
				// if not already in this.events (as tracked by this.names) add it to the array
				if (!this.names.includes(event.name)) {
					this.events.push(eventData);
					// add the name to this.names so we don't add it to this.events again
					this.names.push(event.name);
				} 
			
				this.allEvents.push(eventData);
			});

			this.featuredEvents = this.events;
			this.filterEvents();
		},

		/**
		 * Filters Events by category dropdown and search bar
		 */
		filterEvents() {
			if (!this.search.length && !this.category.length && !this.site.length && !this.name.length) {
				this.events = this.featuredEvents;
			} else {
				this.events = this.allEvents.filter(event => {
					const searchMatched = !this.search.length || (event.name + event.date + event.location + event.category).toLowerCase().includes(this.search.toLowerCase());
					const categoryMatched = !this.category.length || event.category === this.category;
					const siteMatched = event.site == null ? true : (!this.site.length || event.site == this.site);
					const nameMatched = !this.name.length || event.name == this.name;

					return categoryMatched && searchMatched && siteMatched && nameMatched;
				})
			}
		},
	})),

	Alpine.data('CSGroups', (options = {}) => ({
		allFormattedGroups: [],
		cluster: '', // cluster string for filterGroups()
		clusters: [], // clusters array for cluster dropdown
		day: '', // filterGroups() day dropdown string
		days: [], // array to contain days of the week for dropdown
		groups: [],
		options: {show_tags: 1}, //options object to add to the url string
		search: '', // filterGroups() search
		site: '', // site string for filterGroups()
		sites: [], // sites array for site dropdown
		tag: '', // tag string for filterGroups()
		tags: [], // tags array for tag dropdown

		/**
		 * Builds a formatted array of groups data
		 */
		async init() {
			dayjs.locale(CS.locale);

			this.$watch(['day', 'tag', 'search', 'site', 'cluster'], () => this.filterGroups());

			let groups = await CS.fetchJSON('groups', Object.assign(this.options, options));
			
			// load in array of days for day filter dropdown
			this.days = CS.days();
			
			groups.forEach(group => {
				// capture unique categories, tags and sites for dropdowns, then sort them
				if (group.site != null && !this.sites.includes(group.site.name)) this.sites.push(group.site.name);
				if (group.cluster != null && !this.clusters.includes(group.cluster.name)) this.clusters.push(group.cluster.name);
				if (group.tags != null) group.tags.forEach(tag => { if (!this.tags.includes(tag.name)) this.tags.push(tag.name); })
				this.sites.sort();
				this.clusters.sort();
				this.tags.sort();

				// push formatted data to the allFormattedGroups array
				this.allFormattedGroups.push({
					cluster: group.cluster != null ? group.cluster.name : null,
					customFields: group.custom_fields.constructor === Object ? this.buildCustomFields(group) : null, // if no custom fields, JSON provides an empty array
					day: group.day != null ? dayjs().isoWeekday(group.day) : null,
					description: group.description.replace(/\r\n/g, '<br>'),
					frequency: group.frequency == 'custom' ? group.custom_frequency : group.frequency,
					image: group.images.constructor === Object ? group.images.md.url : '',
					link: 'https://' + CS.url + '/groups/' + group.identifier,
					location: group.location.name,
					name: group.name,
					online: group.location.type == 'online',
					site: group.site != null ? group.site.name : null,
					tags: group.tags,
					time: group.time != null ? dayjs((new Date()).toISOString().slice(0, 11) + group.time + ':00') : null,
					_original: group,
				});
			});
			this.groups = this.allFormattedGroups;
			this.filterGroups();
		},

		/**
		 * Build a more helpful array of custom field data for a group from the 3 available versions
		 */
		buildCustomFields(group) {
			// create a formatted list of custom fields
			let formattedCustomFields = [];
			Object.entries(group.custom_fields).forEach(customField => {
				const field = customField[1];
				// just use the version with a formatted_value
				if (field.constructor === Object && field.hasOwnProperty('formatted_value') && field.settings.embed.view) {
					// only add if this field is visible in embed
					formattedCustomFields.push({
						id: field.id,
						name: field.name,
						value: field.formatted_value,
						_original: [
							group.custom_fields['custom' + field.id],
							group.custom_fields['field' + field.id],
							group.custom_fields['field_' + field.id],
						],
					});
				}
			});

			return formattedCustomFields;
		},

		/**
		 * Filters Groups for day and tag dropdowns and search for name
		 */
		filterGroups() {
			this.groups = this.allFormattedGroups.filter(group => {
				const clusterMatched = group.cluster == null && this.cluster.length ? false : (!this.cluster.length || group.cluster == this.cluster);
				const dayMatched = !this.day.length || group.day.format('dddd') == this.day;
				const tagMatched = !this.tag.length || group.tags.map(tag => tag.name).includes(this.tag);
				const searchMatched = !this.search.length || group.name.toLowerCase().includes(this.search.toLowerCase());
				const siteMatched = group.site == null ? true : (!this.site.length || group.site == this.site);
				
				// return dayMatched && tagMatched && searchMatched;
				return dayMatched && tagMatched && searchMatched && siteMatched && clusterMatched;
			})
		},

	}))
});


window.CS = {
	locale: 'en',

	/**
	 * Builds any URL options provided
	 */
	buildOptions: function (options) {
		return (Object.keys(options).length !== 0) ? '?' + (new URLSearchParams(options).toString()) : '';
	},

	/**
	 * Returns the days of the week for dropdowns in whichever language - Sunday first
	 */
	days: function () {
		let days = [];
		for(i = 0; i < 7; i++) days.push(dayjs().isoWeekday(i).format('dddd'));
		return days;
	},

	/**
	 * Fetches JSON data from local cache (expiry 1h) or from ChurchSuite JSON feed. Type is 'events' or 'groups'.
	 */
	fetchJSON: async function (type, options = {}) {
		let data;
		let storedData = localStorage.getItem(type);
		if (storedData != null && JSON.parse(storedData).expires > new Date().getTime()) {
			data = JSON.parse(storedData).json;
		} else {
			await fetch('https://' + CS.url + '/embed/' + (type == 'events' ? 'calendar' : 'smallgroups') + '/json' + this.buildOptions(options))
				.then(response => response.json())
				.then(response => {
					localStorage.setItem(type, JSON.stringify({expires: (new Date()).getTime()+(1000*60*15), json: response})); // JS times in milliseconds, so expire in 1h
					data = response;
				},
			);
		}

		return data;
	},

	/** 
	 * Decodes a string containing HTML entities back into HTML
	 */
	stringToHTML: function (str) {
		div = document.createElement('div');
		div.innerHTML = str;
		return div.textContent || div.innerText || '';
	},
}