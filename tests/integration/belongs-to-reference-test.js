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

moduleFor("service:store", "BelongsToReference", {
  integration: true,

  beforeEach() {
    this.server = new Pretender();

    this.store = this.subject();

    runify(this, "push");
  },

  afterEach() {
    this.server.shutdown();
  }
});

test("parentRef()", async function(assert) {
  let book = this.push({
    data: {
      type: "book",
      id: 1
    }
  });

  let bookRef = book.ref();
  let authorRef = book.belongsTo("author");

  assert.deepEqual(bookRef, authorRef.parentRef());
});
