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

moduleFor("service:store", "hasMany links", {
  integration: true,

  beforeEach() {
    this.server = new Pretender();

    this.store = this.subject();

    runify(this, "push");
    runify(this, "pushPayload");
    runify(this, "findRecord");
    runify(this, "createRecord");
    runify(this, "queryRecord");
  },

  afterEach() {
    this.server.shutdown();
  }
});

test("no links", function(assert) {
  let book = this.push({
    data: {
      id: 1,
      type: 'book',
      relationships: {
        chapters: {
          data: []
        }
      }
    }
  });

  let chaptersRef = book.hasMany("chapters");

  let links = chaptersRef.links();
  assert.equal(links.length, 0);
});

test("links()", function(assert) {
  let book = this.push({
    data: {
      id: 1,
      type: 'book',
      relationships: {
        chapters: {
          links: {
            self: {
              href: "self-link",
              meta: {
                chapters: true
              }
            },
            related: "related-link"
          }
        }
      }
    }
  });

  let chaptersRef = book.hasMany("chapters");

  let links = chaptersRef.links();
  assert.equal(links.length, 2);
});

test("links(name) with link being an object", function(assert) {
  let book = this.push({
    data: {
      id: 1,
      type: 'book',
      relationships: {
        chapters: {
          links: {
            self: {
              href: "self-link",
              meta: {
                chapters: true
              }
            }
          }
        }
      }
    }
  });

  let chaptersRef = book.hasMany("chapters");

  let selfLink = chaptersRef.links("self");
  assert.ok(selfLink);
  assert.equal(selfLink.name(), "self");
  assert.equal(selfLink.href(), "self-link");
  assert.deepEqual(selfLink.meta(), {
    chapters: true
  });
});

test("links(name) with link being a string", function(assert) {
  let book = this.push({
    data: {
      id: 1,
      type: 'book',
      relationships: {
        chapters: {
          links: {
            related: "related-link"
          }
        }
      }
    }
  });

  let chaptersRef = book.hasMany("chapters");

  let relatedLink = chaptersRef.links("related");
  assert.ok(relatedLink);
  assert.equal(relatedLink.name(), "related");
  assert.equal(relatedLink.href(), "related-link");
  assert.notOk(relatedLink.meta());
});
