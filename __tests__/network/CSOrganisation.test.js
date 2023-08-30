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

	// now we've selected a second filter - should still be fine though
	CSO.label = {
		'2': ['c'],
		'3': ['d'],
	}

	expect(CSO.filterModel_Label(model)).toBe(true);

	// finally, we've only selected one this model doesn't have
	CSO.label = {
		'3': ['d'],
	}

	expect(CSO.filterModel_Label(model)).toBe(false);
});