require('../../src/cs')

window.CS.url = 'https://demo.churchsuite.com';

/**
 * Actual Tests!
 */

import Event from '../../src/calendar/event';

// load an example event in, and convert it to JSON
const json = require('./event.json');

// create a group to test
const event = new Event(json);

test('allDay property - is all day', () => {
	const data = { ...json, datetime_start: "2022-05-25 00:00:00", datetime_end: "2022-05-25 23:59:59" }
	const event = new Event(data);
	expect(event.allDay).toBe(true);
});

test('allDay property - is not all day', () => {
	const data = { ...json, datetime_start: "2022-05-25 09:00:00", datetime_end: "2022-05-25 23:59:59" }
	const event = new Event(data);
	expect(event.allDay).toBe(false);
});

test('allDay property - is not all day', () => {
	const data = { ...json, datetime_start: "2022-05-25 00:00:00", datetime_end: "2022-05-25 16:00:00" }
	const event = new Event(data);
	expect(event.allDay).toBe(false);
});

test('categoryId property - provided', () => {
	const data = { ...json, category_id: 64 }
	const event = new Event(data);
	expect(event.categoryId).toBe(64);
});

test('categoryId property - null', () => {
	const data = { ...json, category_id: null }
	const event = new Event(data);
	expect(event.categoryId).toBe(null);
});

test('description property', () => {
	const data = { ...json, description: "<p>Test <strong>BOLD<\/strong> HTML char &rsquo;<\/p>" }
	const event = new Event(data);
	const description = "<p>Test <strong>BOLD<\/strong> HTML char &rsquo;<\/p>";
	expect(event.description).toBe(description);
});

test('end property', () => {
	const data = { ...json, datetime_end: "2022-05-25 00:00:00" }
	const event = new Event(data);
	expect(event.end.format('DD/MM/YYYY')).toBe('25/05/2022');
});

test('image property - provided', () => {
	const data = { ...json, images: { md: { url: 'test' } } }
	const event = new Event(data);
	expect(event.image).toBe('test');
});

test('image property - not provided', () => {
	const data = { ...json, brand: { emblem: 'sandwich' }, images: null }
	const event = new Event(data);
	expect(event.image).toBe(''); // we no longer pull from emblem
});

// if signup is disabled, we can link to event page (they can't sign up anyway!)
test('link property - provided', () => {
	const data = {
		...json,
		url: 'https://demo.churchsuite.com/events/kaboom',
		signup_enabled: false,
	}
	const event = new Event(data);
	expect(event.link).toBe('https://demo.churchsuite.com/events/kaboom');
	expect(event.signupEnabled).toBe(false);
});

// this can never be empty because of the API array
// but check that it isn't linked to the signup_enabled property
test('link property - empty', () => {
	const data = {
		...json,
		url: '',
		signup_enabled: true,
	}
	const event = new Event(data);
	expect(event.link).toBe('');
	expect(event.signupEnabled).toBe(true);
});

test('location property', () => {
	const data = { ...json, location: { name: 'spatula' } }
	const event = new Event(data);
	expect(event.location).toBe('spatula');
});

test('latitude property', () => {
	const data = { ...json, location: { latitude: '12345' } }
	const event = new Event(data);
	expect(event.latitude).toBe('12345');
});

test('longitude property', () => {
	const data = { ...json, location: { longitude: '12345' } }
	const event = new Event(data);
	expect(event.longitude).toBe('12345');
});

test('name property', () => {
	const data = { ...json, name: "The Mythical Trainee BBQ" }
	const event = new Event(data);
	expect(event.name).toBe("The Mythical Trainee BBQ");
});

test('online property - true', () => {
	const data = { ...json, location: { type: 'online' } }
	const event = new Event(data);
	expect(event.online).toBe(true);
});

test('online property - false', () => {
	const data = { ...json, location: { type: 'physical' } }
	const event = new Event(data);
	expect(event.online).toBe(false);
});

test('postcode property', () => {
	const data = { ...json, location: { address: 'NG1 1PR' } }
	const event = new Event(data);
	expect(event.postcode).toBe('NG1 1PR');
});

test('siteIds property - provided', () => {
	const data = { ...json, site_ids: [2,6] }
	const event = new Event(data);
	expect(event.siteIds).toStrictEqual([2,6]);
});

test('site property - not provided', () => {
	const data = { ...json, site_ids: null }
	const event = new Event(data);
	expect(event.siteIds).toBe(null);
});

test('start property', () => {
	const data = { ...json, datetime_start: "2022-05-25 00:00:00" }
	const event = new Event(data);
	expect(event.start.format('DD/MM/YYYY')).toBe('25/05/2022');
});

test('_original property', () => {
	const data = { ...json, pin: 412094 }
	const event = new Event(data);
	expect(event._original.pin).toBe(412094);
});