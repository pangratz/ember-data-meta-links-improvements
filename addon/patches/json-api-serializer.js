import Ember from 'ember';
import DS from 'ember-data';

const { typeOf } = Ember;
const { JSONAPISerializer } = DS;

JSONAPISerializer.reopen({

  normalizeSingleResponse(store, modelClass, payload) {
    let recordLevelMeta = payload.data && payload.data.meta;
    let normalized = this._super(...arguments);

    if (typeOf(normalized.data) === "object") {
      normalized.data._top_level_meta = normalized.meta;
      normalized.data.meta = recordLevelMeta;
    }

    // TODO included

    return normalized;
  },

  normalize(modelClass, resourceHash) {
    let normalized = this._super(...arguments);
    normalized.data.meta = resourceHash.meta;
    return normalized;
  }

});
