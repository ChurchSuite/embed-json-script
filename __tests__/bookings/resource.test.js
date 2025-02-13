import Resource from '../../src/bookings/resource'

const json = {
	id: 12,
	name: 'Resource Name',
	quantity: 12,
	description: 'Some sort of description',
	all_sites: false,
	site_ids: [
		1,
		4
	]
}

const resource = new Resource(json);

test('id property', () => expect(resource.id).toBe(12));
test('name property', () => expect(resource.name).toBe('Resource Name'));
test('quantity property', () => expect(resource.quantity).toBe(12));
test('description property', () => expect(resource.description).toBe('Some sort of description'));
test('all_sites property', () => expect(resource.all_sites).toBe(false));
test('site_ids property', () => expect(resource.site_ids).toStrictEqual([1, 4]));