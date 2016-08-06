import DS from 'ember-data';

const { RESTSerializer } = DS;

RESTSerializer.reopen({

  normalize(model, payload) {
    let normalized = this._super(...arguments);
    normalized.data.meta = payload.meta;
    return normalized;
  },

  pushPayload(store, payload) {
    const orig = store.push;
    let normalized;

    store.push = function(data) {
      normalized = data;
    }

    this._super(...arguments);

    store.push = orig;

    normalized.meta = payload.meta;

    store.push(normalized);
  }

});
