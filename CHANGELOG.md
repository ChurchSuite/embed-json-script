# Change Log

We make updates from time to time, to fix things and add functionality - we'll keep a record of them here!

## [2.1.0] - 2022-03-21

### Added

- new Churches module!
- small groups group.dateEnd dayjs property
- small groups group.active property
- small groups group.endingSoon property
- small groups group.signupFull property
- small groups group.signupRunning property
- all small groups filters now support easy multiselects
- small groups now support beta Embed Configurations

## [2.0.0] - 2022-01-26 - Major Update

We've updated our events JSON feed API, so that it is easier to make feeds with non-featured events. There are also a set of new merge strategies for combining similar events together, which you can choose between using API parameters. Small Groups are unaffected, but Events feeds will need some API parameters to keep the present functionality.

We're also changing our version numbering to standard semver format, [Major.Minor.Patch], so that websites can lock to the major number and receive minor updates and patches without intervention, and committing to only adding functionality or making non-breaking changes in minor and patch releases.

### Breaking Changes

- the script no longer only shows featured events by default; add a {featured: 1} parameter to x-data to keep present functionality

### Added

- our API now gives more control over 'merge strategies', so we've removed the filtering from this script. With no parameters, the API will fall back to merging in the same pattern as this script did, but different merge behaviour can now be set using following parameters: {merge: signup_to_sequence|sequence|sequence_name|show_all}.
- our API also now has more filtering parameters, so while x-init can still be used to filter events in a component, we're recommending to use API parameters instead

### Changed

- all churchsuite.co.uk accounts have now been migrated to churchsuite.com, so we have added a redirect for any websites still setting the CS url to churchsuite.co.uk

### Fixed

- we now check local storage is available and not full before trying to use it, thanks to @andrewpitts15

## [1.1.5] - 2021-12-08

### Changed

- caching update to store query URL, so query changes immediately update local storage

## [1.1.4] - 2021-12-07

### Changed

- bugfix to previous change!

## [1.1.3] - 2021-12-07

### Changed

- minor update to events API behind the scenes

## [1.1.2] - 2021-10-21

### Changed

- group.link now returns an empty string if a group has signup enabled, but does not have 'Sign up through Embed' enabled

## [1.1.1] - 2021-10-21

### Changed

- featured events now show all events in a sequence by default if sequence signup is not enabled
- event.link now provides a link if 'Sign up through Embed' is enabled, or signup is disabled altogether

## [1.1.0] - 2021-09-20 - Major Update

All days, dates and times now use [Day.js](https://day.js.org/docs/en/display/format) for custom formatting.

### Changed

- group.dateStart, group.day and group.time now return Day.js objects
- all days, dates or times are now localisable

### Added

- event.start and event.end have been added, each returning a Day.js object, and allow displaying multiday events properly
- group.members and group.signupCapacity have been added, returning an integer number of members and spaces respectively
- group.signupStart and group.signupEnd have been added, each returning a Day.js object for the signup period (if applicable)
- event name filtering has been added so that an Alpine component can be locked to a single event, for example to return the next Alpha course in a sequence

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
