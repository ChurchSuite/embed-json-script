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
		allEvents: [], // array to contain unfiltered, unmerged events
		categories: [], // a compiled array of all event categories
		category: '', // linked to selected option from dropdown for comparison with the event category
		events: [], // array to contain filtered events
		mergedEvents: [], // array to contain the merged events, depending on merge strategy - first in sequence, etc
		name: '', // name dropdown value
		names: [], // array of possible name values
		options: {include_merged: 1}, // API options
		search: '', // search terms
		site: '', // site dropdown value
		sites: [], // array of possible site values

		async init() {
			dayjs.locale(CS.locale);

			this.$watch(['category', 'search', 'site'], () => this.filterEvents());

			let events = (await CS.fetchJSON('events', Object.assign(this.options, options)));

			events.forEach(event => {
				// capture unique categories and sites
				if (event.category != null && !this.categories.includes(event.category.name)) this.categories.push(event.category.name);
				if (event.site != null && !this.sites.includes(event.site.name)) this.sites.push(event.site.name);

				// sort out link URL
				let link = '';
				if (event.signup_options.embed.enabled == 1) {
					link = event.signup_options.tickets.url;
				} else if (event.signup_options.signup_enabled == 0) {
					link = 'https://' + CS.url + '/events/' + event.identifier;
				}

				let eventData = {
					_original: event,
					allDay: event.datetime_start.slice(-8) == '00:00:00' && event.datetime_end.slice(-8) == '23:59:59',
					brandEmblem: event.brand.emblem,
					category: event.category != null ? event.category.name : null,
					description: CS.stringToHTML(event.description),
					end: dayjs(event.datetime_end),
					image: event.images.constructor === Object ? event.images.md.url : event.brand.emblem,
					link: link,
					location: event.location.name,
					name: event.name,
					online: event.location.type == 'online',
					postcode: event.location.address,
					site: event.site != null ? event.site.name : null,
					start: dayjs(event.datetime_start),
				}

				// build an array of events to show when merged together (first in sequence etc)
				if (event.merged_by_strategy == 0) this.mergedEvents.push(eventData);

				// push the event name to the names array if it is not already present
				if (!this.names.includes(event.name)) this.names.push(event.name);

				// push the eventData to the allEvents array
				this.allEvents.push(eventData);
			});

			this.filterEvents();
		},

		/**
		 * Filters Events by category dropdown and search bar
		 */
		filterEvents() {
			if (!this.search.length && !this.category.length && !this.site.length && !this.name.length) {
				// if we're not filtering by anything, only show merged events (following merge strategy)
				this.events = this.mergedEvents;
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
		cluster: '', // cluster string/array for filterGroups()
		clusters: [], // clusters array for cluster dropdown
		day: '', // filterGroups() day dropdown string/array
		days: CS.days(), // array to contain days of the week for dropdown
		groups: [],
		options: {show_tags: 1}, //options object to add to the url string
		search: '', // filterGroups() search
		site: '', // site string/array for filterGroups()
		sites: [], // sites array for site dropdown
		tag: '', // tag string/array for filterGroups()
		tagsMatch: 'all', // if group needs to match all tags in multiselect - other option is 'any'
		tags: [], // tags array for tag dropdown

		/**
		 * Builds a formatted array of groups data
		 */
		async init() {
			dayjs.locale(CS.locale);

			this.$watch(['day', 'tag', 'search', 'site', 'cluster'], () => this.filterGroups());

			let groups = await CS.fetchJSON('groups', Object.assign(this.options, options));


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
					active: this.isActive(group),
					cluster: group.cluster != null ? group.cluster.name : null,
					customFields: group.custom_fields.constructor === Object ? this.buildCustomFields(group) : null, // if no custom fields, JSON provides an empty array
					dateEnd: group.date_end ? dayjs(group.date_end) : null,
					dateStart: dayjs(group.date_start),
					day: group.day != null ? dayjs().isoWeekday(group.day) : null,
					description: group.description.replace(/\r\n/g, '<br>'),
					endingSoon: this.isEndingSoon(group),
					frequency: group.frequency == 'custom' ? group.custom_frequency : group.frequency,
					image: group.images.constructor === Object ? group.images.md.url : '',
					link: group.embed_signup == 1 || group.signup_enabled == 0 ? 'https://' + CS.url + '/groups/' + group.identifier : '',
					location: group.location.name,
					members: group.no_members,
					name: group.name,
					online: group.location.type == 'online',
					signupCapacity: group.signup_capacity,
					signupStart: group.signup_date_start != null ? dayjs(group.signup_date_start) : null,
					signupEnd: group.signup_date_end != null ? dayjs(group.signup_date_end) : null,
					signupFull: group.signup_full,
					signupRunning: this.isSignupRunning(group),
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
				const searchMatched = !this.search.length || group.name.toLowerCase().includes(this.search.toLowerCase());

				// convert any strings (single selects) into arrays (to behave like multiselect)
				const daysFilter = Array.isArray(this.day) ? this.day : (this.day ? [this.day] : []);
				const tagsFilter = Array.isArray(this.tag) ? this.tag : (this.tag ? [this.tag] : []);
				const clusterFilter = Array.isArray(this.cluster) ? this.cluster : (this.cluster ? [this.cluster] : []);
				const sitesFilter = Array.isArray(this.site) ? this.site : (this.site ? [this.site] : []);

				// filter by group day
				const dayMatched = daysFilter.length == 0 || daysFilter.includes(group.day.format('dddd'));
				
				// filter by group tags
				const groupTags = group.tags.map(tag => tag.name);
				const tagMatched = this.multiselectMatches(groupTags, tagsFilter, this.tagsMatch);

				// filter by group cluster (a group can only belong to one cluster)
				const clusterMatched = clusterFilter.length == 0 || clusterFilter.includes(group.cluster);

				// filter by sites (a group can only belong to one site or all sites [null])
				const siteMatched = group.site == null || sitesFilter.length == 0 || sitesFilter.includes(group.site);

				return dayMatched && tagMatched && searchMatched && siteMatched && clusterMatched;
			})
		},

		/**
		 * Return a boolean as to whether a group is active or not
		 * @param {Object} group The group in question.
		 * @returns {boolean} Whether the group is currently active.
		 */
		isActive(group) {
			let now = dayjs();
			// if the start date isn't in the past, group isn't active
			if (!dayjs(group.date_start).isBefore(now)) return false;
			if (group.date_end) {
				// if the end date is set and isn't in the future, group isn't active
				if (!dayjs(group.date_end).isAfter(now)) return false;
			}

			return true;
		},

		/**
		 * Return a boolean as to whether a group is ending in the next month.
		 * @param {Object} group The group in question.
		 * @returns {boolean} Whether the group ends in the next month.
		 */
		isEndingSoon(group) {
			if (!group.date_end) return false;

			let now = dayjs();
			let dateEnd = dayjs(group.date_end);
			if (dateEnd.subtract(1, 'month').isBefore(now)) return true;

			return false;
		},

		/**
		 * Return a boolean as to whether a group currently has signup active and running.
		 * @param {Object} group The group in question.
		 * @returns {boolean} Whether the group signup is running.
		 */
		isSignupRunning(group) {
			// group must have signup enabled and a signup start date
			if (!group.signup_enabled || !group.embed_signup) return false;
			if (!group.signup_date_start) return false;

			let now = dayjs();
			let dateStart = dayjs(group.signup_date_start);

			// check that signup started before now
			if (!dateStart.isBefore(now)) return false;

			// if signup has an end date, check it is in the future
			if (group.signup_date_end) {
				let dateEnd = dayjs(group.signup_date_end);
				if (!dateEnd.isAfter(now)) return false;
			}

			return true;
		},

		/**
		 * Return a boolean as to whether a group matches a multiselect filter.
		 * Used when a group can have multiple values, e.g. multiple tags.
		 * @param {Array} values The values on the group in question.
		 * @param {Array} multiselect The values selected in the multiselect.
		 * @param {String} matchingBehaviour The matching behaviour - 'all' or 'any'.
		 * @returns {boolean} Whether the group matches.
		 */
		multiselectMatches(values, multiselect, matchingBehaviour) {
			if (multiselect.length == 0) return true;

			// calculate the intersection between group values and multiselect values
			const matches = values.filter(value => multiselect.includes(value));

			// if matching behaviour 'all', group must have every multiselect value
			if (matchingBehaviour == 'all' && matches.length == multiselect.length) return true;

			// if matching behaviour 'any', group must have one of multiselect values
			if (matchingBehaviour == 'any' && matches.length > 0) return true;

			return false;
		}
	})),

	// reusable logic for filter multiselects
	// the filter passed in here is a string matching the filter on the parent - e.g. 'day'
	Alpine.data('multiselect', (filter) => ({
		init() {
			this[filter] = [];
		},
		isSelected(option) {
			return this[filter].includes(option);
		},
		showDropdown: false,
		// toggle an option in one of the multiselect filters
		toggle(option) {
			if (!Array.isArray(this[filter])) this[filter] = [this[filter]]; // reset in case single select on same page
			if (this[filter].includes(option)) {
				// unset the option
				this[filter] = this[filter].filter(value => value != option);
			} else {
				// set the option
				// NOTE using .push() doesn't trigger watch - https://github.com/alpinejs/alpine/issues/383
				this[filter] = this[filter].concat([option]);
			}
		}
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
		let scheme = ['charitysuite', 'churchsuite'].includes(CS.url.split('.').pop()) ? 'http://' : 'https://';
		let url = scheme + CS.url.replace('churchsuite.co.uk', 'churchsuite.com') + '/embed/' + (type == 'events' ? 'calendar' : 'smallgroups') + '/json' + this.buildOptions(options);
		let storedData = this.supportsLocalStorage() ? localStorage.getItem(url) : null;

		if (storedData != null && JSON.parse(storedData).expires > new Date().getTime()) {
			data = JSON.parse(storedData).json;
		} else {
			await fetch(url)
				.then(response => response.json())
				.then(response => {
					if (this.supportsLocalStorage()) {
						try {
							localStorage.setItem(url, JSON.stringify({expires: (new Date()).getTime()+(1000*60*15), json: response})) // JS times in milliseconds, so expire in 15m
						} catch {
							console.error('Unable to cache data');
						}
					}
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

	/**
	 * Check that local storage works in browser
	 */
	supportsLocalStorage: function() {
		try {
			return 'localStorage' in window && window['localStorage'] !== null;
		}
		catch {
			return false;
		}
	},
}