import Address from '../../src/components/address'

const json = {
	line_1: 'Line 1',
	line_2: 'Line 2',
	line_3: 'Line 3',
	city: 'City',
	county: 'County',
	country: 'Country',
	postcode: 'Postcode',
	latitude: 52.942637,
	longitude: -1.171216
}

const address = new Address(json);

test('line1 property', () => expect(address.line1).toBe('Line 1'));
test('line2 property', () => expect(address.line2).toBe('Line 2'));
test('line3 property', () => expect(address.line3).toBe('Line 3'));
test('city property', () => expect(address.city).toBe('City'));
test('county property', () => expect(address.county).toBe('County'));
test('country property', () => expect(address.country).toBe('Country'));
test('postcode property', () => expect(address.postcode).toBe('Postcode'));
test('latitude property', () => expect(address.latitude).toBe(52.942637));
test('longitude property', () => expect(address.longitude).toBe(-1.171216));