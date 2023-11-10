require('../../src/cs')

window.CS.url = 'https://demo.churchsuite.com';


/**
 * Actual Tests!
 */

import Group from '../../src/smallgroups/group';

// load an example group in, and convert it to JSON
const json = require('./group.json');

// create a group to test
const group = new Group(json);

test('active property - group starts tomorrow', () => {
	const data = { ...json, date_start: dayjs().add(1, 'day').format('YYYY-MM-DD') }
	const group = new Group(data);
	expect(group.active).toBe(false);
});

test('active property - group already finished', () => {
	const start = dayjs().subtract(1, 'week').format('YYYY-MM-DD');
	const end = dayjs().subtract(1, 'day').format('YYYY-MM-DD');
	const data = { ...json, date_start: start, date_end: end }
	const group = new Group(data);
	expect(group.active).toBe(false);
});

test('active property - group should be active', () => {
	const start = dayjs().subtract(1, 'week').format('YYYY-MM-DD');
	const end = dayjs().add(1, 'week').format('YYYY-MM-DD');
	const data = { ...json, date_start: start, date_end: end }
	const group = new Group(data);
	expect(group.active).toBe(true);
});

let customFields = {
	field_1280: {
		id: 1280,
		resource_type: 'churchsuite_module',
		resource_id: 9,
		order: 1,
		type: 'text',
		name: 'Leader/s',
		help: null,
		options: null,
		formatted_options: '',
		value: '',
		formatted_value: '',
		required: false,
		settings: {
			my: { edit: true, view: true, required: false },
			embed: { edit: false, view: true, required: false },
			connect: { edit: false, view: false, required: false }
		},
		ctime: '2022-05-04 23:21:36',
		cuser: 'Paul',
		mtime: '2022-05-04 23:22:32',
		muser: 'Paul'
	},
	custom1280: '',
	field1280: {
		id: '1280',
		order: 1,
		type: 'text',
		name: 'Leader/s',
		value: ''
	}
};

test('customFields property - provided, embed visible', () => {
	const data = { ...json, custom_fields: customFields }
	const group = new Group(data);

	expect(group.customFields[0].id).toBe(1280);
	expect(group.customFields[0].name).toBe('Leader/s');
	expect(group.customFields[0].value).toBe('');
	expect(group.customFields[0]._original[2].required).toBe(false);
});

test('customFields property - provided, embed not visible', () => {
	customFields.field_1280.settings.embed.view = false;
	const data = { ...json, custom_fields: customFields }
	const group = new Group(data);

	expect(group.customFields).toBe(null);
});

test('customFields property - none given', () => {
	const data = { ...json, custom_fields: [] }
	const group = new Group(data);
	expect(group.customFields).toBe(null);
});

test('dateEnd property - not provided', () => {
	const data = { ...json, date_end: '' }
	const group = new Group(data);
	expect(group.dateEnd).toBe(null);
});

test('dateEnd property - provided', () => {
	const data = { ...json, date_end: '2024-09-14' }
	const group = new Group(data);
	expect(group.dateEnd.format('DD/MM/YYYY')).toBe('14/09/2024');
});

test('dateStart property', () => {
	expect(group.dateStart.format('DD/MM/YYYY')).toBe('01/02/2018');
});

test('day property - given', () => {
	expect(group.day.format('dddd')).toBe('Wednesday');
});

test('day property - null', () => {
	const data = { ...json, day: null }
	const group = new Group(data);
	expect(group.day).toBe(null);
});

// test that description property has newlines converted to HTML
test('description property', () => {
	const data = { ...json, description: "We love <br> newlines" }
	const group = new Group(data);
	const description = 'We love <br> newlines';
	expect(group.description).toBe(description);
});

test('description property - null', () => {
	const data = { ...json, description: null }
	const group = new Group(data);
	expect(group.description).toBe(null);
});

test('embedSignup property - true', () => {
	const data = { ...json, embed_signup: true }
	const group = new Group(data);
	expect(group.embedSignup).toBe(true);
});

test('embedSignup property - false', () => {
	const data = { ...json, embed_signup: false }
	const group = new Group(data);
	expect(group.embedSignup).toBe(false);
});

test('endingSoon property - ended already', () => {
	const end = dayjs().subtract(1, 'week').format('YYYY-MM-DD');
	const data = { ...json, date_end: end }
	const group = new Group(data);
	expect(group.endingSoon).toBe(false);
});

test('endingSoon property - ending soon', () => {
	const end = dayjs().add(1, 'week').format('YYYY-MM-DD');
	const data = { ...json, date_end: end }
	const group = new Group(data);
	expect(group.endingSoon).toBe(true);
});

test('endingSoon property - not ending soon', () => {
	const end = dayjs().add(1, 'year').format('YYYY-MM-DD');
	const data = { ...json, date_end: end }
	const group = new Group(data);
	expect(group.endingSoon).toBe(false);
});

test('frequency property - standard', () => {
	const group = new Group({ ...json, frequency: 'weekly' });
	expect(group.frequency).toBe('weekly');
});

test('frequency property - custom', () => {
	const group = new Group({ ...json, custom_frequency: 'every other minute', frequency: 'custom' });
	expect(group.frequency).toBe('every other minute');
});

test('image property - provided', () => {
	expect(group.image).toBe('https://cdn.churchsuite.com/2mCEi8cf/smallgroups/groups/2_uxcyQI88_md.png');
});

test('image property - not given', () => {
	const group = new Group({ ...json, images: [] });
	expect(group.image).toBe('');
});

// embed signup enabled - provide link
test('link property - signup enabled, embed signup enabled', () => {
	const group = new Group({ ...json, identifier: 'test', embed_signup: true, signup_enabled: true });
	expect(group.link).toBe('https://demo.churchsuite.com/groups/test');
});

test('link property - no URL scheme', () => {
	window.CS.url = 'demo.churchsuite.com';
	const group = new Group({ ...json, identifier: 'test', embed_signup: true, signup_enabled: true });
	expect(group.link).toBe('https://demo.churchsuite.com/groups/test');
	window.CS.url = 'https://demo.churchsuite.com';
});

// if signup not enabled, we give a link because they can't sign up anyway
test('link property - signup disabled', () => {
	const group = new Group({ ...json, identifier: 'test', embed_signup: false, signup_enabled: false });
	expect(group.link).toBe('https://demo.churchsuite.com/groups/test');
});

// if embed signup disabled, just don't provide a link
test('link property - signup enabled, embed signup disabled', () => {
	const group = new Group({ ...json, embed_signup: false, signup_enabled: true });
	expect(group.link).toBe('');
});

test('location property', () => {
	const group = new Group({ ...json, location: { name: 'The Moon' } });
	expect(group.location).toBe('The Moon');
});

test('latitude property', () => {
	const group = new Group({ ...json, location: { latitude: -1.234 } });
	expect(group.latitude).toBe(-1.234);
});

test('longitude property', () => {
	const group = new Group({ ...json, location: { longitude: 42.678 } });
	expect(group.longitude).toBe(42.678);
});

test('members property', () => {
	expect(group.members).toBe(23);
});

test('name property', () => {
	expect(group.name).toBe('Beeston Daytime (Online)');
});

test('online property - in person', () => {
	const group = new Group({ ...json, location: { type: 'physical' } });
	expect(group.online).toBe(false);
});

test('online property - online', () => {
	const group = new Group({ ...json, location: { type: 'online' } });
	expect(group.online).toBe(true);
});

test('signupCapacity property', () => {
	const group = new Group({ ...json, signup_capacity: 12 });
	expect(group.signupCapacity).toBe(12);
});

test('signupFull property - full', () => {
	const group = new Group({ ...json, signup_full: true });
	expect(group.signupFull).toBe(true);
});

test('signupFull property - not full', () => {
	const group = new Group({ ...json, signup_full: false });
	expect(group.signupFull).toBe(false);
});

// signup_date_start alawys provided, even if signup not enabled
test('signupStart property - provided', () => {
	const group = new Group({ ...json, signup_date_start: '2021-01-01' });
	expect(group.signupStart.format('DD/MM/YYYY')).toBe('01/01/2021');
});

test('signupEnd property - provided', () => {
	const group = new Group({ ...json, signup_date_end: '2021-05-01' });
	expect(group.signupEnd.format('DD/MM/YYYY')).toBe('01/05/2021');
});

test('signupEnd property - not given', () => {
	const group = new Group({ ...json, signup_date_end: '' });
	expect(group.signupEnd).toBe(null);
});

test('signupInFuture property - signup not enabled', () => {
	const group = new Group({ ...json, embed_signup: false });
	expect(group.signupInFuture).toBe(false);
});

test('signupInFuture property - signup already running', () => {
	const start = dayjs().subtract(1, 'week').format('YYYY-MM-DD');
	const end = dayjs().add(1, 'week').format('YYYY-MM-DD');
	const group = new Group({ ...json, embed_signup: true, signup_enabled: true, signup_date_start: start, signup_date_end: end });
	expect(group.signupInFuture).toBe(false);
});

test('signupInFuture property - signup already finished', () => {
	const start = dayjs().subtract(1, 'week').format('YYYY-MM-DD');
	const end = dayjs().subtract(1, 'day').format('YYYY-MM-DD');
	const group = new Group({ ...json, embed_signup: true, signup_enabled: true, signup_date_start: start, signup_date_end: end });
	expect(group.signupInFuture).toBe(false);
});

test('signupInFuture property - signup in future', () => {
	const start = dayjs().add(1, 'day').format('YYYY-MM-DD');
	const end = dayjs().add(1, 'week').format('YYYY-MM-DD');
	const group = new Group({ ...json, embed_signup: true, signup_enabled: true, signup_date_start: start, signup_date_end: end });
	expect(group.signupInFuture).toBe(true);
});

test('signupRunning property - running', () => {
	const start = dayjs().subtract(1, 'week').format('YYYY-MM-DD');
	const end = dayjs().add(1, 'week').format('YYYY-MM-DD');
	const group = new Group({ ...json, embed_signup: true, signup_enabled: true, signup_date_start: start, signup_date_end: end });
	expect(group.signupRunning).toBe(true);
});

test('signupRunning property - signup not enabled', () => {
	const start = dayjs().subtract(1, 'week').format('YYYY-MM-DD');
	const end = dayjs().add(1, 'week').format('YYYY-MM-DD');
	const group = new Group({ ...json, embed_signup: false, signup_enabled: false, signup_date_start: start, signup_date_end: end });
	expect(group.signupRunning).toBe(false);
});

test('signupRunning property - no start date', () => {
	const group = new Group({ ...json, embed_signup: true, signup_enabled: true, signup_date_start: '' });
	expect(group.signupRunning).toBe(false);
});

test('signupRunning property - embed signup not enabled', () => {
	const start = dayjs().subtract(1, 'week').format('YYYY-MM-DD');
	const end = dayjs().add(1, 'week').format('YYYY-MM-DD');
	const group = new Group({ ...json, embed_signup: false, signup_enabled: true, signup_date_start: start, signup_date_end: end });
	expect(group.signupRunning).toBe(false);
});

test('signupRunning property - signup finished already', () => {
	const start = dayjs().subtract(1, 'week').format('YYYY-MM-DD');
	const end = dayjs().subtract(1, 'day').format('YYYY-MM-DD');
	const group = new Group({ ...json, embed_signup: true, signup_enabled: true, signup_date_start: start, signup_date_end: end });
	expect(group.signupRunning).toBe(false);
});

test('signupRunning property - signup not started yet', () => {
	const start = dayjs().add(1, 'day').format('YYYY-MM-DD');
	const end = dayjs().add(1, 'week').format('YYYY-MM-DD');
	const group = new Group({ ...json, embed_signup: true, signup_enabled: true, signup_date_start: start, signup_date_end: end });
	expect(group.signupRunning).toBe(false);
});

test('site_id property - provided', () => {
	const group = new Group({ ...json, site_id: 34 });
	expect(group.siteId).toBe(34);
});

test('site_id property - not provided', () => {
	const group = new Group({ ...json, site_id: null });
	expect(group.siteId).toBe(null);
});

test('time property - provided', () => {
	const group = new Group({ ...json, time: '20:00' });
	expect(group.time.format('h:mm A')).toBe('8:00 PM');
});

test('time property - not provided', () => {
	const group = new Group({ ...json, time: null });
	expect(group.time).toBe(null);
});

test('original property', () => {
	// check for a property we don't use
	expect(group._original.id).toBe(2);
});