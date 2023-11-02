import Resource from '../../src/bookings/resource'

const json = {
	id: 12,
	name: 'Resource Name',
	category: 'Cat',
	status: 'active',
	quantity: 12,
	description: 'Some sort of description'
}

const resource = new Resource(json);

test('id property', () => expect(resource.id).toBe(12));
test('name property', () => expect(resource.name).toBe('Resource Name'));
test('category property', () => expect(resource.category).toBe('Cat'));
test('status property', () => expect(resource.status).toBe('active'));
test('quantity property', () => expect(resource.quantity).toBe(12));
test('description property', () => expect(resource.description).toBe('Some sort of description'));