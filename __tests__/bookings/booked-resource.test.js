require('../../src/cs')

import BookedResource from '../../src/bookings/booked-resource'

const json = {
	"id": 17687,
	"name": "Lounge",
	"datetime_start": "2023-11-01 08:00:00",
	"datetime_end": "2023-11-01 11:30:00",
	"resource_id": 5,
	"quantity": 1
}

const bookedResource = new BookedResource(json);

test('name property', () => expect(bookedResource.name).toBe('Lounge'));
test('quantity property', () => expect(bookedResource.quantity).toBe(1));
test('start property', () => expect(bookedResource.start.isSame(dayjs("2023-11-01 08:00:00"))).toBe(true));
test('end property', () => expect(bookedResource.end.isSame(dayjs("2023-11-01 11:30:00"))).toBe(true));
test('resource id property', () => expect(bookedResource.resourceId).toBe(5));
test('_original property', () => expect(bookedResource._original).toBe(json));