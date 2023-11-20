import Category from '../../src/calendar/category'

const json = {
	id: 12,
	name: 'Category Name',
	colour: 'FFF000',
	status: 'active',
}

const category = new Category(json);

test('id property', () => expect(category.id).toBe(12));
test('name property', () => expect(category.name).toBe('Category Name'));
test('colour property', () => expect(category.colour).toBe('FFF000'));
test('status property', () => expect(category.status).toBe('active'));