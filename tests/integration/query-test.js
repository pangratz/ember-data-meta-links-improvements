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

moduleFor("service:store", "store.query", {
  integration: true,

  beforeEach() {
    this.server = new Pretender();

    this.store = this.subject();

    runify(this, "query");
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

  let books = await this.query('book', {});

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

  let books = await this.query('book', {});

  let nextLink = books.ref().links("next");
  assert.ok(nextLink);
  assert.equal(nextLink.name(), "next");
  assert.equal(nextLink.href(), "next-link");
  assert.deepEqual(nextLink.meta(), { next: true });
});

test("links().load()", async function(assert) {
  this.server.get('/books', function() {
    return [200, {}, JSON.stringify({
      data: [{
        id: 1,
        type: 'book'
      }],
      links: {
        next: "/next-link",
        prev: "/prev-link"
      }
    })];
  });

  let books = await this.query('book', {});

  this.server.get('/next-link', function() {
    return [200, {}, JSON.stringify({
      data: [{
        type: "book",
        id: 2
      }],
      meta: {
        isNext: true
      }
    })];
  });

  let nextLink = books.ref().links("next");
  let next = await nextLink.load();

  assert.equal(next.get('length'), 1);
  assert.deepEqual(next.ref().meta(), { isNext: true });

  let book2Ref = this.store.getReference("book", 2);
  assert.deepEqual(book2Ref.meta("response"), { isNext: true });
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

  let books = await this.query('book', {});

  let booksRef = books.ref();
  assert.deepEqual(booksRef.meta(), { topLevel: true });
});
