import Configuration from '../../src/bookings/configuration'

const json = require('./configuration.json')

const config = new Configuration(json);

test('uuid property', () => expect(config.uuid).toBe(json.uuid));
test('brand_id property', () => expect(config.brand_id).toBe(json.brand_id));
test('name property', () => expect(config.name).toBe(json.name));
test('description property', () => expect(config.description).toBe(json.description));
test('filterByResource property', () => expect(config.filterByResource).toBe(json.filter_by_resources));
test('numOfMonths property', () => expect(config.numOfMonths).toBe(json.num_months));
test('dayStartTime property', () => expect(config.dayStartTime).toBe(json.day_start_time));
test('dayEndTime property', () => expect(config.dayEndTime).toBe(json.day_end_time));
test('weekStartDay property', () => expect(config.weekStartDay).toBe(json.week_start_day));
