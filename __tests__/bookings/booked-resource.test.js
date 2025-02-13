require('../../src/cs')

import BookedResource from '../../src/bookings/booked-resource'

const json = {
	"id": 22477,
	"resource_id": 43,
	"quantity": 1,
	"starts_at": "2025-02-12T08:00:00Z",
	"ends_at": "2025-02-12T11:30:00Z"
}

const bookedResource = new BookedResource(json);

test('id property', () => expect(bookedResource.id).toBe(22477));
test('quantity property', () => expect(bookedResource.quantity).toBe(1));
test('start property', () => expect(bookedResource.start.isSame(dayjs("2025-02-12T08:00:00Z"))).toBe(true));
test('end property', () => expect(bookedResource.end.isSame(dayjs("2025-02-12T11:30:00Z"))).toBe(true));
test('resource id property', () => expect(bookedResource.resourceId).toBe(43));
