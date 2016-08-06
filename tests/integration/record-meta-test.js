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

moduleFor("service:store", "single record meta", {
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

test("via store.push(single)", function(assert) {
  let book = this.push({
    data: {
      id: 1,
      type: 'book',
      meta: {
        recordLevel: true
      }
    },
    meta: {
      topLevel: true
    }
  });

  let meta = book.ref().meta();
  assert.deepEqual(meta, {
    recordLevel: true
  });

  let topLevelMeta = book.ref().meta("response");
  assert.deepEqual(topLevelMeta, {
    topLevel: true
  });
});

test("via store.pushPayload(single)", function(assert) {
  this.pushPayload({
    data: {
      id: 1,
      type: 'book',
      meta: {
        recordLevel: true
      }
    },
    meta: {
      topLevel: true
    }
  });

  let bookRef = this.store.getReference("book", 1);

  let meta = bookRef.meta();
  assert.deepEqual(meta, {
    recordLevel: true
  });

  let topLevelMeta = bookRef.meta("response");
  assert.deepEqual(topLevelMeta, {
    topLevel: true
  });
});

test("via store.push(array)", function(assert) {
  let array = this.push({
    data: [{
      id: 1,
      type: 'book',
      meta: {
        recordLevel: "first"
      }
    } , {
      id: 2,
      type: 'book',
      meta: {
        recordLevel: "second"
      }
    }],
    meta: {
      topLevel: true
    }
  });

  assert.deepEqual(array[0].ref().meta(), {
    recordLevel: "first"
  });

  assert.deepEqual(array[1].ref().meta(), {
    recordLevel: "second"
  });
});

test("via included", function(assert) {
  this.push({
    data: null,
    included: [{
      id: 1,
      type: 'book',
      meta: {
        recordLevel: "first"
      }
    } , {
      id: 2,
      type: 'book',
      meta: {
        recordLevel: "second"
      }
    }],
    meta: {
      topLevel: true
    }
  });

  let firstBookRef = this.store.getReference("book", 1);
  assert.deepEqual(firstBookRef.meta(), {
    recordLevel: "first"
  });

  let secondBookRef = this.store.getReference("book", 2);
  assert.deepEqual(secondBookRef.meta(), {
    recordLevel: "second"
  });

  // TODO API for getting top level meta: store.pushRef()?
});

test("via store.findRecord()", async function(assert) {
  this.server.get('/books/1', function() {
    return [200, {}, JSON.stringify({
      data: {
        type: 'book',
        id: 1,
        meta: {
          recordLevel: true
        }
      },
      meta: {
        topLevel: true
      }
    })];
  });

  let book = await this.findRecord('book', 1);

  let meta = book.ref().meta();
  assert.deepEqual(meta, {
    recordLevel: true
  });

  let topLevelMeta = book.ref().meta("response");
  assert.deepEqual(topLevelMeta, {
    topLevel: true
  });
});

test("via store.queryRecord()", async function(assert) {
  this.server.get('/books', function() {
    return [200, {}, JSON.stringify({
      data: {
        type: 'book',
        id: 1,
        meta: {
          recordLevel: true
        }
      },
      meta: {
        topLevel: true
      }
    })];
  });

  let book = await this.queryRecord('book', {});

  let meta = book.ref().meta();
  assert.deepEqual(meta, {
    recordLevel: true
  });

  let topLevelMeta = book.ref().meta("response");
  assert.deepEqual(topLevelMeta, {
    topLevel: true
  });
});

test("via store.createRecord()", async function(assert) {
  this.server.post('/books', function() {
    return [200, {}, JSON.stringify({
      data: {
        type: 'book',
        id: 1,
        meta: {
          recordLevel: true
        }
      },
      meta: {
        topLevel: true
      }
    })];
  });

  let book = this.createRecord('book');
  await run(book, "save");

  let meta = book.ref().meta();
  assert.deepEqual(meta, {
    recordLevel: true
  });

  let topLevelMeta = book.ref().meta("response");
  assert.deepEqual(topLevelMeta, {
    topLevel: true
  });
});

test("via store.updateRecord()", async function(assert) {
  this.server.patch('/books/1', function() {
    return [200, {}, JSON.stringify({
      data: {
        type: 'book',
        id: 1,
        meta: {
          recordLevel: true
        }
      },
      meta: {
        topLevel: true
      }
    })];
  });

  let book = this.push({
    data: {
      type: 'book',
      id: 1
    }
  });
  await run(book, "save");

  let meta = book.ref().meta();
  assert.deepEqual(meta, {
    recordLevel: true
  });

  let topLevelMeta = book.ref().meta("response");
  assert.deepEqual(topLevelMeta, {
    topLevel: true
  });
});

test("works for rest serializer", async function(assert) {
  this.server.get('/rest-books/1', function() {
    return [200, {}, JSON.stringify({
      "rest-book": {
        id: 1,
        meta: {
          recordLevel: true
        }
      },
      meta: {
        topLevel: true
      }
    })];
  });

  let book = await this.findRecord("rest-book", 1);

  let meta = book.ref().meta();
  assert.deepEqual(meta, {
    recordLevel: true
  });

  let topLevelMeta = book.ref().meta("response");
  assert.deepEqual(topLevelMeta, {
    topLevel: true
  });
});

test("pushPayload(single) works with rest serializer", async function(assert) {
  this.pushPayload("rest-book", {
    "rest-book": {
      id: 1,
      meta: {
        recordLevel: true
      }
    },
    meta: {
      topLevel: true
    }
  });

  let bookRef = this.store.getReference("rest-book", 1);

  let meta = bookRef.meta();
  assert.deepEqual(meta, {
    recordLevel: true
  });

  let topLevelMeta = bookRef.meta("response");
  assert.deepEqual(topLevelMeta, {
    topLevel: true
  });
});

test("pushPayload(array) works with rest serializer", async function(assert) {
  this.pushPayload("rest-book", {
    "rest-books": [{
      id: 1,
      meta: {
        recordLevel: true
      }
    }],
    meta: {
      topLevel: true
    }
  });

  let bookRef = this.store.getReference("rest-book", 1);

  let meta = bookRef.meta();
  assert.deepEqual(meta, {
    recordLevel: true
  });

  let topLevelMeta = bookRef.meta("response");
  assert.deepEqual(topLevelMeta, {
    topLevel: true
  });
});
