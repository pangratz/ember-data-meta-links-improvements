import "ember-data-meta-links-improvements";
import Ember from "ember";
import Pretender from "pretender";
import { moduleFor, test } from "ember-qunit";

const { run } = Ember;

function runify(context, method) {
  context[method] = function() {
    return run(context.store, method, ...arguments);
  };
}

moduleFor("service:store", "store.findAll", {
  integration: true,

  beforeEach() {
    this.server = new Pretender();

    this.store = this.subject();

    runify(this, "findAll");
  },

  afterEach() {
    this.server.shutdown();
  }
});

test("ref().value()", async function(assert) {
  this.server.get('/books', function() {
    return [200, {}, JSON.stringify({
      data: [{
        id: 1,
        type: 'book'
      }]
    })];
  });

  let books = await this.findAll('book');

  assert.deepEqual(books, books.ref().value());
});

test("links()", async function(assert) {
  this.server.get('/books', function() {
    return [200, {}, JSON.stringify({
      data: [{
        id: 1,
        type: 'book'
      }],
      links: {
        next: {
          href: "next-link",
          meta: {
            next: true
          }
        }
      }
    })];
  });

  let books = await this.findAll('book');

  let nextLink = books.ref().links("next");
  assert.ok(nextLink);
  assert.equal(nextLink.name(), "next");
  assert.equal(nextLink.href(), "next-link");
  assert.deepEqual(nextLink.meta(), { next: true });
});

test("meta()", async function(assert) {
  this.server.get('/books', function() {
    return [200, {}, JSON.stringify({
      data: [{
        id: 1,
        type: 'book'
      }],
      meta: {
        topLevel: true
      }
    })];
  });

  let books = await this.findAll('book');

  let booksRef = books.ref();
  assert.deepEqual(booksRef.meta(), { topLevel: true });
});

test("meta() is updated", async function(assert) {
  let counter;

  this.server.get('/books', function() {
    return [200, {}, JSON.stringify({
      data: [{
        id: 1,
        type: 'book'
      }],
      meta: {
        topLevel: counter
      }
    })];
  });

  counter = "first";
  let books = await this.findAll('book');

  let booksRef = books.ref();
  assert.deepEqual(booksRef.meta(), { topLevel: "first" });

  counter = "second";
  await this.findAll('book', { reload: true });

  assert.deepEqual(booksRef.meta(), { topLevel: "second" });
});
