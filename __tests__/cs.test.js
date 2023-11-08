require('../src/cs')

import CSMultiSelect from '../src/components/csMultiSelect'
import CSEvents from '../src/calendar/CSEvents'
import CSOrganisations from '../src/network/CSOrganisations'
import CSGroups from '../src/smallgroups/CSGroups'

test('dayjs is on window', () => {
	expect(window.dayjs.en.weekdays).toEqual([
		'Sunday',
		'Monday',
		'Tuesday',
		'Wednesday',
		'Thursday',
		'Friday',
		'Saturday',
	])
})

describe('check dayjs locales are loaded', () => {
	let locales = ['da', 'de', 'es', 'fr', 'it', 'nl', 'pl', 'sv', 'sk']
	locales.forEach(function (locale) {
		test(locale + ' locale', () => {
			expect(window.dayjs.Ls[locale].name).toEqual(locale)
		})
	})
})

test('dayjs isoWeek plugin is loaded', () => {
	expect(window.dayjs().isoWeekday(1).format('dddd')).toEqual('Monday')
})

// test('CSMultiSelect is on window', () => {
// 	expect(window.CSMultiSelect()).toBeInstanceOf(CSMultiSelect)
// })
test('CSOrganisations is on window', () => {
	expect(new window.CSOrganisations()).toBeInstanceOf(CSOrganisations)
})
test('CSEvents is on window', () => {
	expect(new window.CSEvents()).toBeInstanceOf(CSEvents)
})
test('CSGroups is on window', () => {
	expect(new window.CSGroups()).toBeInstanceOf(CSGroups)
})

describe('CS object', () => {
	test('default locale', () => {
		expect(window.CS.locale).toEqual('en')
	})

	describe('buildOptions method', () => {
		test('options provided', () => {
			expect(window.CS.buildOptions({ key: 'value' })).toEqual('?key=value')
		})

		test('no options provided', () => {
			expect(window.CS.buildOptions({})).toEqual('')
		})
	})

	describe('cacheJSONData method', () => {
		test('stored in local storage successfully', () => {
			// fake the system time, to prevent 1 second errors if test runs slowly
			jest.useFakeTimers('modern').setSystemTime(new Date('2022-01-01T13:00:00'));

			window.CS.cacheJSONData('value', 'key')
			let expected = JSON.stringify({
				expires: new Date('2022-01-01T13:15:00').getTime(),
				json: 'value',
			})
			expect(localStorage.getItem('key')).toEqual(expected)
		})

		test('console error if unsupported', () => {
			// set localStorage up to fail
			let setItem = window.localStorage.__proto__.setItem
			window.localStorage.__proto__.setItem = jest.fn().mockImplementation(() => {
				throw new Error()
			})

			// spy on the console.error function (and prevent it erroring)
			let spy = jest.spyOn(console, 'error').mockImplementation(() => {})

			// trigger the error
			window.CS.cacheJSONData('', '')

			expect(spy).toHaveBeenCalled()

			// restore setItem
			window.localStorage.__proto__.setItem = setItem
		})
	})

	test('dayOfWeekOptions method', () => {
		expect(window.CS.dayOfWeekOptions()).toEqual([
			{ id: 'Monday', name: 'Monday' },
			{ id: 'Tuesday', name: 'Tuesday' },
			{ id: 'Wednesday', name: 'Wednesday' },
			{ id: 'Thursday', name: 'Thursday' },
			{ id: 'Friday', name: 'Friday' },
			{ id: 'Saturday', name: 'Saturday' },
			{ id: 'Sunday', name: 'Sunday' },
		])
	})

	describe('detectURLScheme method', () => {
		test('scheme already provided on URL', () => {
			window.CS.url = 'https://demo.churchsuite.com'
			expect(window.CS.detectURLScheme()).toEqual('')
		})

		test('ChurchSuite internal testing domain', () => {
			window.CS.url = 'demo.churchsuite'
			expect(window.CS.detectURLScheme()).toEqual('http://')
		})

		test('normal church domain', () => {
			window.CS.url = 'demo.churchsuite.com'
			expect(window.CS.detectURLScheme()).toEqual('https://')
		})
	})
})
