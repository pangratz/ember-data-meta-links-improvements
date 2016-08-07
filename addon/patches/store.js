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

    if (data.__is_findAll) {
      let recordArray = this.peekAll(data.__primaryModelName);
      recordArray.ref().__update_meta(data.meta);
      recordArray.ref().__update_links(data.links);
    }

    return pushed;
  },

  didSaveRecord(internalModel, { data }) {
    internalModel.recordReference.__update_meta(data.meta);
    internalModel.recordReference.__update_responseMeta(data._top_level_meta);
    return this._super(...arguments);
  },

  loadLink(link) {
    let modelName = link.parentRef().modelName();
    let href = link.href();
    let model = this.modelFor(modelName);
    let adapter = this.adapterFor(modelName);
    let serializer = this.serializerFor(modelName);

    return adapter.findLink(href).then((payload) => {
      // TODO handle case where primary data of link is single resource
      let normalized = serializer.normalizeArrayResponse(this, model, payload);
      let pushed = this.push(normalized);
      let recordArray = this.recordArrayManager.createAdapterPopulatedRecordArray(modelName, {});
      recordArray.loadRecords(pushed, normalized);
      return recordArray;
    });
  }

});
