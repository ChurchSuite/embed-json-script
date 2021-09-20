# Change Log

We make updates from time to time, to fix things and add functionality - we'll keep a record of them here!

## [1.1.0] - 2021-09-20 - Major Update

All days, dates and times now use [Day.js](https://day.js.org/docs/en/display/format) for custom formatting.

### Changed

- group.dateStart, group.day and group.time now return Day.js objects

### Added

- event.start and event.end have been added, each returning a Day.js object, and allow displaying multiday events properly
- group.members and group.signupCapacity have been added, returning an integer number of members and spaces respectively
- group.signupStart and group.signupEnd have been added, each returning a Day.js object for the signup period (if applicable)

### Removed

- event.date, event.shortDate and event.time have been replaced by event.start and event.end, which contain all the information

## [1.0.9] - 2021-09-08

### Changed

- for groups with custom frequencies, group.frequency now returns the custom frequency value instead of 'custom'

### Fixed

- sorted 'InvalidDate' time and day properties for groups with custom frequencies

## [1.0.8] - 2021-09-08

### Fixed

- fixed a bug where x-init filtered components sometimes didn't show fully until second page load

## [1.0.7] - 2021-09-08

### Added

- added an online property to Events to match Groups
- provided the facility to send custom URL parameters to the ChurchSuite API

## [1.0.6] - 2021-09-07

### Changed

- included the year on Event date and shortDate properties

## [1.0.5] - 2021-09-06

### Added

- added an allDay property to Events

## [1.0.4] - 2021-09-06

### Changed

- changed Groups time format to match Events
