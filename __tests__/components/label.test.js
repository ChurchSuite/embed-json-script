import Label from '../../src/components/label'

const json = {
	id: 12,
	name: 'Name',
	colour: 'green',
	multiple_responses: true,
	options: ['test'],
}

const label = new Label(json);

test('id property', () => expect(label.id).toBe(12));
test('name property', () => expect(label.name).toBe('Name'));
test('color property', () => expect(label.color).toBe('green'));
test('multiple property', () => expect(label.multiple).toBe(true));
test('options property', () => expect(label.options).toBe(json.options));