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

test('brandEmblem property', () => {
	const data = { ...json, brand: { emblem: 'test' } }
	const event = new Event(data);
	expect(event.brandEmblem).toBe('test');
});

test('category property - provided', () => {
	const data = { ...json, category: { name: 'test' } }
	const event = new Event(data);
	expect(event.category).toBe('test');
});

test('category property - null', () => {
	const data = { ...json, category: null }
	const event = new Event(data);
	expect(event.category).toBe(null);
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
	expect(event.image).toBe('sandwich');
});

// if signup is disabled, we can link to event page (they can't sign up anyway!)
test('link property - signup not enabled', () => {
	const data = { 
		...json, 
		identifier: 'kaboom',
		signup_options: {
			embed: { enabled: "0" },
			signup_enabled: "0",
		}
	}
	const event = new Event(data);
	expect(event.link).toBe('https://demo.churchsuite.com/events/kaboom');
});

// if embed signup enabled, give them a link
test('link property - embed signup enabled', () => {
	const data = { 
		...json, 
		signup_options: {
			embed: { enabled: "1" },
			signup_enabled: "1",
			tickets: { url: 'banana' }
		}
	}
	const event = new Event(data);
	expect(event.link).toBe('banana');
});

// if signup enabled but embed signup disabled, don't give a link
test('link property - embed signup disabled, signup enabled', () => {
	const data = { 
		...json, 
		signup_options: {
			embed: { enabled: "0" },
			signup_enabled: "1",
		}
	}
	const event = new Event(data);
	expect(event.link).toBe('');
});

// if signup is disabled, we can link to event page (they can't sign up anyway!)
test('link property - no url scheme', () => {
	window.CS.url = 'demo.churchsuite.com';
	const data = { 
		...json, 
		identifier: 'kaboom',
		signup_options: {
			embed: { enabled: "0" },
			signup_enabled: "0",
		}
	}
	const event = new Event(data);
	expect(event.link).toBe('https://demo.churchsuite.com/events/kaboom');
});

test('location property', () => {
	const data = { ...json, location: { name: 'spatula' } }
	const event = new Event(data);
	expect(event.location).toBe('spatula');
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

test('site property - provided', () => {
	const data = { ...json, site: { name: 'ChurchSuite Ltd' } }
	const event = new Event(data);
	expect(event.site).toBe('ChurchSuite Ltd');
});

test('site property - not provided', () => {
	const data = { ...json, site: null }
	const event = new Event(data);
	expect(event.site).toBe(null);
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