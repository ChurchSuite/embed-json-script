import Category from '../../src/calendar/category'

const json = {
	id: 12,
	name: 'Category Name',
	brand_id: 15,
	color: 'FFF000',
	status: 'active',
}

const category = new Category(json);

test('id property', () => expect(category.id).toBe(12));
test('name property', () => expect(category.name).toBe('Category Name'));
test('brand_id property', () => expect(category.brand_id).toBe(15));
test('color property', () => expect(category.color).toBe('FFF000'));
test('status property', () => expect(category.status).toBe('active'));