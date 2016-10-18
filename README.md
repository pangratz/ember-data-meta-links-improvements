# ember-data-meta-links-improvements

[![Build Status](https://travis-ci.org/pangratz/ember-data-meta-links-improvements.svg?branch=master)](https://travis-ci.org/pangratz/ember-data-meta-links-improvements)
[![Ember Observer Score](https://emberobserver.com/badges/ember-data-meta-links-improvements.svg)](https://emberobserver.com/addons/ember-data-meta-links-improvements)

This addon is a Proof of Concept for
[RFC#160](https://github.com/emberjs/rfcs/pull/160) which aims to improve the
meta and links situation within Ember Data.
The goal is to see how the proposed API solves use cases when used in real
applications. The outcome of this addon should be a profound test suite which
covers all the use cases of the RFC.

:warning: The current implementation heavily relies on patches of Ember Data
internals, so it is definitely not encouraged to use in production, as
stability and decent performance can not be guaranteed. Also, the proposed API
of the RFC and this addon might diverge, though the goal is to keep them in
alignment within a narrow time frame :warning:

Currently the following improvements are implemented:

- [x] [single record meta data](#single-record-meta-data) ([tests](tests/integration/record-meta-test.js))
  - [x] get record level meta data via `record.ref().meta()`
  - [x] get response level meta data for single resource via `record.ref().meta("response")`
- [ ] links for relationship references
  - [ ] belongs to
  - [x] [has many](#has-many-links) ([tests](tests/integration/has-many-links-test.js))
- [ ] meta and links for finders
  - [ ] queryRecord (meta works, links still missing)
  - [x] [query](#storequery) ([tests](tests/integration/query-test.js))
  - [x] [findAll](#storefindall) ([tests](tests/integration/findAll-test.js))
- [ ] get reference for has-many via `hasManyRelationship.ref()`
- [ ] get parent reference for relationship reference
  - [x] belongs to ([tests](tests/integration/belongs-to-reference-test.js))
  - [ ] has many
- [ ] add hook when new data is received
  - [ ] `Model#didReceiveData`
- [ ] further miscellaneous changes
  - [x] get parent reference of link via `linkRef.parentRef()`

## Installation

`ember install ember-data-meta-links-improvements`

## Code samples

### Single record meta data

```js
// GET /books/1
// {
//   data: {
//     type: "book",
//     id: 1,
//     meta: {
//       recordLevel: true
//     }
//   },
//   meta: {
//     topLevel: true
//   }
// }
this.store.findRecord('book', 1).then(function(book) {
  // get reference for record
  let bookRef = book.ref();

  // get record level meta data
  let meta = bookRef.meta();
  meta === { recordLevel: true };

  // get response level meta data
  let topLevelMeta = bookRef.meta("response");
  topLevelMeta === { topLevel: true };
});
```

### Has-many links

```js
// GET /books/1
// {
//   data: {
//     type: "book",
//     id: 1,
//     relationships: {
//       chapters: {
//         links: {
//           related: "related-link",
//           self: {
//             href: "self-link",
//             meta: {
//               selfLink: true
//             }
//           }
//         }
//       }
//     }
//   }
// }
this.store.findRecord('book', 1).then(function(book) {
  let chaptersRef = book.hasMany("chapters");

  let related = chaptersRef.links("related");
  related.href() === "related-link";

  let next = chaptersRef.links("self");
  next.meta() === { selfLink: true };

  // GET /self-link
  // {
  //   data: [],
  //   meta: {
  //     isSelf: true
  //   }
  // }
  next.load().then(function(nextArray) {
    nextArray.ref().meta() === { isSelf: true }
  });
});
```

### `store.query`

```js
// GET /books?page=2
// {
//   data: [{
//     type: "book",
//     id: 1
//   }],
//   links: {
//     next: {
//       href: "/books?page=3",
//       meta: {
//         isLast: true
//       }
//     },
//     prev: {
//       href: "/books?page=1"
//     }
//   },
//   meta: {
//     total: 123
//   }
// }
let books = await this.store.query('book', { page: 2 }).then(function(books) {
  let booksRef = books.ref();

  let prev = booksRef.links("prev");
  prev.href() === "/books?page=1";

  let next = booksRef.links("next");
  next.meta() === { isLast: true };

  let meta = booksRef.meta();
  meta === { total: 123 };
});

// GET /books?page=3
// {
//   data: [{
//     type: "book",
//     id: 1
//   }],
//   links: {
//     prev: {
//       href: "/books?page=2"
//     }
//   },
//   meta: {
//     isLastPage: true
//   }
// }
let next = await books.ref().links("next").load();

next.ref().meta() === { isLastPage: true }
```

### `store.findAll`

```js
// GET /books
// {
//   data: [{
//     type: "book",
//     id: 1
//   }],
//   links: {
//     self: "self-link"
//   },
//   meta: {
//     total: 123
//   }
// }
let books = await this.store.findAll('book');

let booksRef = books.ref();

let self = booksRef.links("self");
self.href() === "self-link";

let meta = booksRef.meta();
meta === { total: 123 };

// GET /books
// {
//   data: [{
//     type: "book",
//     id: 1
//   }],
//   meta: {
//     total: 456
//   }
// }
await this.store.findAll('book', { reload: true });

booksRef.meta() === { total: 456 };
```

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
