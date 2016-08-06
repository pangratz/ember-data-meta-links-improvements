import DS from 'ember-data';

const { Store, Model } = DS;

Store.reopen({

  push(data) {
    let pushed = this._super(...arguments);

    if (Model.detectInstance(pushed)) {
      let recordRef = pushed.ref();
      recordRef.__update_meta(data.data.meta);
      recordRef.__update_responseMeta(data.meta);

      let relationships = data.data.relationships || {};
      Object.keys(relationships).forEach((name) => {
        let links = relationships[name].links;
        pushed.hasMany(name).__update_links(links);
      });
    }

    if (Array.isArray(pushed)) {
      data.data.forEach(({ type, id, meta }) => {
        let recordReference = this.getReference(type, id);
        recordReference.__update_meta(meta);
        recordReference.__update_responseMeta(data.meta);
      });
    }

    if (Array.isArray(data.included)) {
      data.included.forEach(({ type, id, meta }) => {
        this.getReference(type, id).__update_meta(meta);
      });
    }

    return pushed;
  },

  didSaveRecord(internalModel, { data }) {
    internalModel.recordReference.__update_meta(data.meta);
    internalModel.recordReference.__update_responseMeta(data._top_level_meta);
    return this._super(...arguments);
  }

});
