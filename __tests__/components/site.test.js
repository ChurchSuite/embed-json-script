import Site from '../../src/components/site'

const json = {
	id: 12,
	name: 'Site 1',
	initials: 'S1',
	color: 'orange',
	order: 4,
	address: {
		line1: 'Line 1',
		line2: 'Line 2',
		line3: 'Line 3',
		city: 'City',
		county: 'County',
		country: 'Country',
		postcode: 'Postcode',
	}
}

const site = new Site(json);

test('id property', () => expect(site.id).toBe(12));
test('name property', () => expect(site.name).toBe('Site 1'));
test('initials property', () => expect(site.initials).toBe('S1'));
test('color property', () => expect(site.color).toBe('orange'));
test('order property', () => expect(site.order).toBe(4));
test('address property', () => expect(site.address.line1).toBe('Line 1'));