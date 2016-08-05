# ember-data-meta-links-improvements

[![Build Status](https://travis-ci.org/pangratz/ember-data-meta-links-improvements.svg?branch=master)](https://travis-ci.org/pangratz/ember-data-meta-links-improvements)
[![Ember Observer Score](https://emberobserver.com/badges/ember-data-meta-links-improvements.svg)](https://emberobserver.com/addons/ember-data-meta-links-improvements)

Proof of Concept for [RFC#160](https://github.com/emberjs/rfcs/pull/160).

This addon is a Proof of Concept for
[RFC#160](https://github.com/emberjs/rfcs/pull/160) which aims to improve the
meta and links situation within Ember Data.
The goal is to see how the proposed API solves use cases when used in real
applications. The outcome of this addon should be a profound test suite which
covers all the use cases of the RFC.

:warning: The current implementation heavily relies on patches of Ember Data
internals, so it is definitely not encouraged to use in production, as
stability and decent performance can not be guaranteed. :warning:

Currently the following improvements are implemented:

- [ ] single record meta data
  - [ ] get record level meta data via `record.ref().meta()`
  - [ ] get response level meta data for single resource via `record.ref().meta("response")`
- [ ] links for relationship references
  - [ ] belongs to
  - [ ] has many
- [ ] meta and links for finders
  - [ ] queryRecord
  - [ ] query
  - [ ] findAll
- [ ] get reference for has-many via `hasManyRelationship.ref()`
- [ ] get parent reference for relationship reference
  - [ ] belongs to
  - [ ] has many
- [ ] add hook when new data is received
  - [ ] `Model#didReceiveData`
- [ ] further miscellaneous changes

## Installation

`ember install ember-data-meta-links-improvements`

## Code samples

# Development

## Installation

* `git clone` this repository
* `npm install`
* `bower install`

## Running

* `ember serve`
* Visit your app at http://localhost:4200.

## Running Tests

* `npm test` (Runs `ember try:testall` to test your addon against multiple Ember versions)
* `ember test`
* `ember test --server`

## Building

* `ember build`

For more information on using ember-cli, visit [http://ember-cli.com/](http://ember-cli.com/).
