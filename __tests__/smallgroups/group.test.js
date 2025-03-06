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
	const data = { ...json, starts_at: dayjs().add(1, 'day').format('YYYY-MM-DD') }
	const group = new Group(data);
	expect(group.active).toBe(false);
});

test('active property - group already finished', () => {
	const start = dayjs().subtract(1, 'week').format('YYYY-MM-DD');
	const end = dayjs().subtract(1, 'day').format('YYYY-MM-DD');
	const data = { ...json, starts_at: start, ends_at: end }
	const group = new Group(data);
	expect(group.active).toBe(false);
});

test('active property - group should be active', () => {
	const start = dayjs().subtract(1, 'week').format('YYYY-MM-DD');
	const end = dayjs().add(1, 'week').format('YYYY-MM-DD');
	const data = { ...json, starts_at: start, ends_at: end }
	const group = new Group(data);
	expect(group.active).toBe(true);
});

let customFields = [
    {
      "id": 2418,
      "formatted_value": "kingshope.church/arnold",
      "value": "kingshope.church/arnold"
    }
];

test('customFields property - provided', () => {
	const data = { ...json, custom_fields: customFields }
	const group = new Group(data);

	expect(group.customFields[0].id).toBe(2418);
	expect(group.customFields[0].formatted_value).toBe('kingshope.church/arnold');
	expect(group.customFields[0].value).toBe('kingshope.church/arnold');
});

test('customFields property - none given', () => {
	const data = { ...json, custom_fields: [] }
	const group = new Group(data);
	expect(group.customFields).toEqual([]);
});

test('dateEnd property - not provided', () => {
	const data = { ...json, ends_at: '' }
	const group = new Group(data);
	expect(group.dateEnd).toBe(null);
});

test('dateEnd property - provided', () => {
	const data = { ...json, ends_at: '2024-09-14' }
	const group = new Group(data);
	expect(group.dateEnd.format('DD/MM/YYYY')).toBe('14/09/2024');
});

test('dateStart property - provided', () => {
	expect(group.dateStart.format('DD/MM/YYYY')).toBe('05/09/2021');
});

test('dateStart property - not provided', () => {
	const data = { ...json, starts_at: '' }
	const group = new Group(data);
	expect(group.dateStart).toBe(null);
});

test('day property - given', () => {
	expect(group.day).toBe('Wednesday');
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

test('signupEnabled property - true', () => {
	const signup_options = {
		"capacity": 20,
		"starts_at": "2023-08-28",
		"ends_at": null
	}
	const data = { ...json, signup_options: signup_options }
	const group = new Group(data);
	expect(group.signupEnabled).toBe(true);
});

test('signupEnabled property - false', () => {
	const data = { ...json, signup_options: null }
	const group = new Group(data);
	expect(group.signupEnabled).toBe(false);
});

test('endingSoon property - ended already', () => {
	const end = dayjs().subtract(1, 'week').format('YYYY-MM-DD');
	const data = { ...json, ends_at: end }
	const group = new Group(data);
	expect(group.endingSoon).toBe(false);
});

test('endingSoon property - ending soon', () => {
	const end = dayjs().add(1, 'week').format('YYYY-MM-DD');
	const data = { ...json, ends_at: end }
	const group = new Group(data);
	expect(group.endingSoon).toBe(true);
});

test('endingSoon property - not ending soon', () => {
	const end = dayjs().add(1, 'year').format('YYYY-MM-DD');
	const data = { ...json, ends_at: end }
	const group = new Group(data);
	expect(group.endingSoon).toBe(false);
});

test('frequency property - standard', () => {
	const group = new Group({ ...json, frequency: 'weekly' });
	expect(group.frequency).toBe('weekly');
});

test('id property', () => {
	const group = new Group({ ...json, id: 1235 });
	expect(group.id).toBe(1235);
});

test('image property - provided', () => {
	expect(group.image.medium).toBe('https://cdn.churchsuite.com/2mCEi8cf/smallgroups/groups/112_Vg4iWA86_md.png');
});

test('image property - not given', () => {
	const group = new Group({ ...json, image: null });
	expect(group.image).toBe(null);
});

// embed signup enabled - provide link
test('link property', () => {
	const group = new Group({ ...json, identifier: 'test', signup_options: {} });
	expect(group.link).toBe('https://demo.churchsuite.com/groups/test');
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
	expect(group.members).toBe(12);
});

test('name property', () => {
	expect(group.name).toBe('Arnold - North (Online)');
});

test('online property - in person', () => {
	const group = new Group({ ...json, location: { type: 'physical' } });
	expect(group.online).toBe(false);
});

test('online property - online', () => {
	const group = new Group({ ...json, location: { type: 'online' } });
	expect(group.online).toBe(true);
});

test('online property - null', () => {
	const group = new Group({ ...json, location: null });
	expect(group.online).toBe(null);
});

test('signupCapacity property', () => {
	const group = new Group({ ...json });
	expect(group.signupCapacity).toBe(20);
});

test('signupFull property - full', () => {
	const group = new Group({ ...json, num_members: 12, signup_options: {capacity: 12} });
	expect(group.signupFull).toBe(true);
});

test('signupFull property - not full', () => {
	const group = new Group({ ...json, num_members: 12, signup_options: {capacity: 20} });
	expect(group.signupFull).toBe(false);
});

// signup_date_start alawys provided, even if signup not enabled
test('signupStart property - provided', () => {
	const group = new Group({ ...json, signup_options: {starts_at: '2021-01-01'}});
	expect(group.signupStart.format('DD/MM/YYYY')).toBe('01/01/2021');
});

test('signupEnd property - provided', () => {
	const group = new Group({ ...json, signup_options: {ends_at: '2021-05-01'} });
	expect(group.signupEnd.format('DD/MM/YYYY')).toBe('01/05/2021');
});

test('signupEnd property - not given', () => {
	const group = new Group({ ...json, signup_options: {ends_at: null} });
	expect(group.signupEnd).toBe(null);
});

test('signupInFuture property - signup not enabled', () => {
	const group = new Group({ ...json, embed_signup: false });
	expect(group.signupInFuture).toBe(false);
});

test('signupInFuture property - signup already running', () => {
	const start = dayjs().subtract(1, 'week').format('YYYY-MM-DD');
	const end = dayjs().add(1, 'week').format('YYYY-MM-DD');
	const group = new Group({ ...json, signup_options: {starts_at: start, ends_at: end }});
	expect(group.signupInFuture).toBe(false);
});

test('signupInFuture property - signup already finished', () => {
	const start = dayjs().subtract(1, 'week').format('YYYY-MM-DD');
	const end = dayjs().subtract(1, 'day').format('YYYY-MM-DD');
	const group = new Group({ ...json, signup_options: {starts_at: start, ends_at: end }});
	expect(group.signupInFuture).toBe(false);
});

test('signupInFuture property - signup in future', () => {
	const start = dayjs().add(1, 'day').format('YYYY-MM-DD');
	const end = dayjs().add(1, 'week').format('YYYY-MM-DD');
	const group = new Group({ ...json, signup_options: {starts_at: start, ends_at: end }});
	expect(group.signupInFuture).toBe(true);
});

test('signupRunning property - running', () => {
	const start = dayjs().subtract(1, 'week').format('YYYY-MM-DD');
	const end = dayjs().add(1, 'week').format('YYYY-MM-DD');
	const group = new Group({ ...json, signup_options: {starts_at: start, ends_at: end }});
	expect(group.signupRunning).toBe(true);
});

test('signupRunning property - signup not enabled', () => {
	const group = new Group({ ...json, embed_signup: false, signup_options: null });
	expect(group.signupRunning).toBe(false);
});

test('signupRunning property - signup finished already', () => {
	const start = dayjs().subtract(1, 'week').format('YYYY-MM-DD');
	const end = dayjs().subtract(1, 'day').format('YYYY-MM-DD');
	const group = new Group({ ...json, signup_options: {starts_at: start, ends_at: end }});
	expect(group.signupRunning).toBe(false);
});

test('signupRunning property - signup not started yet', () => {
	const start = dayjs().add(1, 'day').format('YYYY-MM-DD');
	const end = dayjs().add(1, 'week').format('YYYY-MM-DD');
	const group = new Group({ ...json, signup_options: {starts_at: start, ends_at: end }});
	expect(group.signupRunning).toBe(false);
});

test('siteIds property - provided', () => {
	// API data comes over as strings - make sure it's an integer for filtering
	const group = new Group({ ...json, all_sites: false, site_ids: [34] });
	expect(group.siteIds).toStrictEqual([34]);
});

test('time property - provided', () => {
	const group = new Group({ ...json, time: '20:00' });
	expect(group.time.format('h:mm A')).toBe('8:00 PM');
});

test('time property - not provided', () => {
	const group = new Group({ ...json, time: null });
	expect(group.time).toBe(null);
});