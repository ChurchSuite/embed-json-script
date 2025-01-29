import CSOrganisations from '../../src/network/CSOrganisations';

/**
 * Set up dependencies on the virtual window
 */
var dayjs = require('dayjs')

// require isoweek to create dayjs objects for days
var isoWeek = require('dayjs/plugin/isoWeek')
dayjs.extend(isoWeek)
window.dayjs = dayjs

window.CS = {url: 'https://demo.churchsuite.com'};

/**
 * Label filtering should be an OR check rather than AND - if two labels are
 * selected, any organisation that is one OR the other should be returned.
 */
test('label filtering', () => {
	let CSO = new CSOrganisations;
	let model = {
		labels: [
			{
				id: 1, // label id 1
				value: ['a'], // label options
			},
			{
				id: 2,
				value: ['b', 'c'],
			},
		]
	}

	CSO.label = {
		'2': null
	}
	
	// we've selected no labels, so model should be included
	expect(CSO.filterModel_Label(model)).toBe(true);

	// option C has been selected for label 2
	CSO.label = {
		'2': ['c']
	}

	// the model has label 2 with a value of c, should be fine
	expect(CSO.filterModel_Label(model)).toBe(true);

	// now we've selected a second filter that matches - should still be fine though
	CSO.label = {
		'1': ['a'],
		'2': ['c'],
	}

	expect(CSO.filterModel_Label(model)).toBe(true);

	// we've selected two filters - we match one but not the other, so we shouldn't be included
	CSO.label = {
		'1': ['a'],
		'3': ['d'], // this is another label that the model doesn't match
	}

	expect(CSO.filterModel_Label(model)).toBe(false);

	// finally, we've only selected one this model doesn't have
	CSO.label = {
		'3': ['d'],
	}

	expect(CSO.filterModel_Label(model)).toBe(false);
});