import DS from "ember-data";

const { AdapterPopulatedRecordArray } = DS;

AdapterPopulatedRecordArray.reopen({

  init() {
    this._super(...arguments);

    this._ref = new RecordArrayReference({ recordArray: this });
  },

  ref() {
    return this._ref;
  },

  loadRecords(records, payload) {
    this._super(...arguments);

    this._ref.__update_meta(payload.meta);
    this._ref.__update_links(payload.links);
  }

});
