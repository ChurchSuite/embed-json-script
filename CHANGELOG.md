# Change Log

We make updates from time to time, to fix things and add functionality - we'll keep a record of them here!

## [4.3.9] - 2025-01-29

### Fixed

- NE Organisation and SG Group label filters now filter correctly when multiple label filters are used

## [4.3.7] - 2024-09-02

### Added

- SG Group, NE Organisation, CA Event and BO Booked Resource models all now have an id property, so that all models now have a consistent unique id property

## [4.3.5] - 2024-08-30

### Added

- Added a 'status' property to CA event, to start removing the need for the _original key

## [4.3.4] - 2024-01-31

### Fixed

- Bug fix for groups not filtering by site, caused by group siteId not being typed properly as int/null

## [4.3.3] - 2024-01-03

### Fixed

- Bug fix for groups/organisations/events/bookedResources properties not initialising to match models property when no filtering occurs

## [4.3.2] - 2023-11-30

### Fixed

- Bug fix for group custom fields still filtering by the deprecated embed view setting which may not be present in the field object

## [4.3.1] - 2023-11-30

### Fixed

- Bug fix for event page link - we always provide one in the JSON now rather than removing it when embed sign-up wasn't available.
- Bug fix for signupEnabled prop so that this doesn't just follow the presence of a link in the json.

## [4.3.0] - 2023-11-20

This update brings with it some significant changes to the way CSEvents works - they now use a paginated response which contains categories, sites, brands and configuration data. Event information can be found in the data Array. This change allows us to be more efficient for large datasets.

### Breaking Changes

- The event class has been stripped back to only include the essential information
- categoryOptions and siteOptions have been removed from CSEvents
- Event 'brandEmblem' property has been removed - the brand information can be found in the 'brand' property of the root response.
- Event 'site' property has been removed in favour of siteIds - full sites information can be found in the sites array in the root response
- Event 'category' property has been removed in favour of categoryId - full categories information can be found in the categories array in the root response
- Event 'merged_by_strategy' has been removed in favour of a unique 'mergeIdentifier' which can be used with the CSEvents 'mergeIdentifier' array to combine events within the feed. This ensures that merge strategies can be used across multiple pages rather than the boolean approach previous

### Added

- Added a new hasValue() method to csMultiSelect returning true if the multi select has a value
- Added a new category object with a consistent tested output including the core category information

## [4.2.1] - 2023-11-13

### Fixed

- Bug fix for turning off location in the configuration settings when viewing a map
- Bug fix for the IE check when using firefox - the userAgent test method was throwing a false positive for 'rc:'

## [4.2.0] - 2023-11-08

This update brings with it some significant changes to the way CSGroups works - they now use a paginated response which contains labels, sites, brands and configuration data. Group information can be found in the data Array. This change allows us to be more efficient for large datasets.

Events are, at the moment, unaffected by the changes.

### Breaking Changes

- It is no longer possible to use v4 of the JSON script with the publicly accessible JSON feed. An embed configuration must be used from within ChurchSuite. This update has been made for security, performance and consistency reasons.
- For developers wanting to make use of the legacy JSON scripts we recommend utilising v3 of this script at the most stable way to do so.
- All references to tag filter has been removed from the CSGroups class
- clusterOptions, dayOptions, siteOptions and tagOptions have been removed from CSGroups
- Group 'site' property has been removed in favour of siteId - full sites information can be found in the sites array
- Group 'cluster' property has been removed in favour of clusterId - full clusters information can be found in the clusters array
- Utility daysOfWeek, getColorRgba, hexToRgb methods have been removed from CS

## [4.1.0] - 2023-11-02

### Added

- A new CSBookedResources class now interacts with new Bookings embed configuration functionality coming to ChurchSuite
- Anonymised resource bookings come across in JSON to populate an embeddable free/busy planner
- The CS fetchJSON method now throws an error object if there is a problem which can be surfaced in the UI using the errorMessage property or the stored error object.

### Changed

- Brand objects now include the brand css to inject into pages for additional styling
- CS.postInit now receives the initial response JSON for use when extending the CS class

## [4.0.4] - 2023-09-04

### Fixed

- The CSOrganisation site filter property is now consistently an array.

## [4.0.3] - 2023-08-31

### Added

- A new brand property has been added, for use with embed configurations

## [4.0.2] - 2023-08-30

### Fixed

- Bugfix for Organisation label filtering issues

## [4.0.0] - 2023-08-10 - Major Update

We've made some fairly major changes to how Network Organisations are handled - they now use a paginated response, which contains labels, sites and brands separately. This change allows us to be more efficient for large datasets.

Events and Groups should be unaffected by the changes.

### Changed

- Organisation sites now use a new Site (and Address) class
- Organisation labels now use a new Brand class, and are no longer scraped from the organisations
- Organisations now have a siteId rather than a site property - the site data can be retrieved from the CSOrganisations sites array

## [3.1.5] - 2023-08-25

### Fixed

- Bugfix for issues caused by 3.13 release of Alpine

## [3.1.4] - 2023-02-07

### Fixed

- a mistake in the ISO 639-1 language code for Swedish has been corrected

## [3.1.3] - 2022-11-03

### Fixed

- a bug with Network organisations showing when filtered by labels has been fixed

## [3.1.2] - 2022-11-01

### Fixed

- the target for ESBuild is now set to ES6 to hopefully solve issues with Safari 13.1

## [3.1.1] - 2022-09-29

### Fixed

- the link property on Calendar Events now has a URL scheme when CS.url does not have one

## [3.1.0] - 2022-09-28

### Changed

- the beta Churches module has been renamed to Network

## [3.0.2] - 2022-09-27

### Changed

- bugfix for days of week in filters not translating based on CS.locale

## [3.0.1] - 2022-08-30

### Changed

- bugfix so that small groups without clusters show when not filtering by cluster

## [3.0.0] - 2022-08-26 - Major Update

We've reworked the structure of the JS such that it's more modular, thus easier to maintain and develop. You now can use a minified JS for a specific module, as well as the combined "cdn.min.js" file. We've also added a selection of helpful properties to groups to make life easier, added support for the beta Churches module, and added support for easy multiselects across the board! This should be fully backwards compatible with v2.0.2, but is a significant change, so we are releasing as a major version.

### Added

- New minified module JS files in the dist/ folder, or you can continue to use the combined JS.
- New JS classes for each model; Group, Church, Event. Each class has added properties.
- new Churches module!
- new CSMultiSelect component to make multiselects easy
- small groups group.dateEnd dayjs property
- small groups group.active property
- small groups group.endingSoon property
- small groups group.signupFull property
- small groups group.signupInFuture property
- small groups group.signupRunning property
- all small groups filters now support easy multiselects
- small groups now support beta Embed Configurations
- automated testing for a large chunk of the project

## [2.0.2] - 2022-05-17

### Changed

- bugfix to null days for Small Groups

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
