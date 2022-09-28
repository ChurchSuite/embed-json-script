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
 * Actual Tests!
 */

import Organisation from '../../src/churches/organisation';

// load an example church in, and convert it to JSON
const json = require('./church.json');

// create a group to test
const church = new Organisation(json);

test('charityNumber property', () => {
	const data = { ...json, charity_number: '12345' }
	const church = new Organisation(data);
	expect(church.charityNumber).toBe('12345');
});

test('customFields property', () => {
	const customFields = {
		field_1325: {
			id: 1325,
			resource_type: "churchsuite_module",
			resource_id: 10,
			order: 1,
			type: "radio",
			name: "Has toilets?",
			help: null,
			options: [
				{
					id: '7a07958c-efa8-4340-a603-086c6955d963',
					name: 'Yes',
					status: 'active'
				},
				{
					id: '2cb93031-dfa1-4703-a200-c3bd2d6cc075',
					name: 'No',
					status: 'active'
				}
			],
			value: { id: '7a07958c-efa8-4340-a603-086c6955d963' },
			formatted_value: 'Yes',
			required: false,
			settings: []
		}
	};
	const data = { ...json, custom_fields: customFields }
	const church = new Organisation(data);


	expect(church.customFields.field_1325.id).toBe(1325);
});

test('email property', () => {
	const data = { ...json, email: 'support@churchsuite.com' }
	const church = new Organisation(data);
	expect(church.email).toBe('support@churchsuite.com');
});

test('image property - provided', () => {
	const data = { ...json, images: { md: { url: 'google.com' } } }
	const church = new Organisation(data);
	expect(church.image).toBe('google.com');
});

test('image property - not provided', () => {
	const data = { ...json, images: null }
	const church = new Organisation(data);
	expect(church.image).toBe('');
});

const exampleAddress = {
	"id": 2967,
	"line1": "1, Main Street",
	"line2": "Bulwell",
	"line3": null,
	"city": "Nottingham",
	"county": null,
	"postcode": "NG1 5GH",
	"country": null,
	"latitude": null,
	"longitude": null
};

test('meetingAddress property', () => {
	const data = { ...json, meeting_address: exampleAddress }
	const church = new Organisation(data);
	expect(church.meetingAddress).toEqual(exampleAddress);
});

test('latitude property - given', () => {
	let address = exampleAddress;
	address.latitude = '-0.2345';
	const data = { ...json, meeting_address: address }
	const church = new Organisation(data);

	expect(church.latitude).toBe('-0.2345');
});

test('latitude property - null', () => {
	const data = { ...json, meeting_address: null }
	const church = new Organisation(data);

	expect(church.latitude).toBe(null);
});

test('longitude property - given', () => {
	let address = exampleAddress;
	address.longitude = '-0.2345';
	const data = { ...json, meeting_address: address }
	const church = new Organisation(data);

	expect(church.longitude).toBe('-0.2345');
});

test('longitude property - null', () => {
	const data = { ...json, meeting_address: null }
	const church = new Organisation(data);

	expect(church.longitude).toBe(null);
});

test('name property', () => {
	const data = { ...json, name: 'Kings Hope Church' }
	const church = new Organisation(data);
	expect(church.name).toBe('Kings Hope Church');
});

test('officeAddress property', () => {
	const data = { ...json, office_address: exampleAddress }
	const church = new Organisation(data);
	expect(church.officeAddress).toEqual(exampleAddress);
});

test('singleAddress property - true', () => {
	const data = { ...json, single_address: true }
	const church = new Organisation(data);
	expect(church.singleAddress).toBe(true);
});

test('singleAddress property - false', () => {
	const data = { ...json, single_address: false }
	const church = new Organisation(data);
	expect(church.singleAddress).toBe(false);
});

test('site property - given', () => {
	const data = { ...json, site: { name: 'The DSU' } }
	const church = new Organisation(data);
	expect(church.site).toBe('The DSU');
});

test('site property - null', () => {
	const data = { ...json, site: null }
	const church = new Organisation(data);
	expect(church.site).toBe(null);
});

test('telephone property', () => {
	const data = { ...json, telephone: '01234567890' }
	const church = new Organisation(data);
	expect(church.telephone).toBe('01234567890');
});

test('urls property', () => {
	const urls = [
		'https://kingshope.church',
		'https://twitter.com/kingshope',
		'https://www.instagram.com/churchsuite_'
	];
	const data = { ...json, urls: urls }
	const church = new Organisation(data);
	expect(church.urls).toEqual(urls);
});

test('_original property', () => {
	const data = { ...json, muser: 'Ant' }
	const church = new Organisation(data);
	expect(church._original.muser).toBe('Ant');
});