import Address from '../../src/components/address'

const json = {
	line1: 'Line 1',
	line2: 'Line 2',
	line3: 'Line 3',
	city: 'City',
	county: 'County',
	country: 'Country',
	postcode: 'Postcode',
}

const address = new Address(json);

test('line1 property', () => expect(address.line1).toBe('Line 1'));
test('line2 property', () => expect(address.line2).toBe('Line 2'));
test('line3 property', () => expect(address.line3).toBe('Line 3'));
test('city property', () => expect(address.city).toBe('City'));
test('county property', () => expect(address.county).toBe('County'));
test('country property', () => expect(address.country).toBe('Country'));
test('postcode property', () => expect(address.postcode).toBe('Postcode'));