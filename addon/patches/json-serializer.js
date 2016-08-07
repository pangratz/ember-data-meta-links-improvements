import DS from "ember-data";

const { JSONSerializer } = DS;

JSONSerializer.reopen({

  normalizeFindAllResponse(store, modelClass) {
    let normalized = this._super(...arguments);
    normalized.__is_findAll = true;
    normalized.__primaryModelName = modelClass.modelName;
    return normalized;
  }

});
