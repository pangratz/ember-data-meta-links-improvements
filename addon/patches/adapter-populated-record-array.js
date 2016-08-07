import DS from "ember-data";

const { AdapterPopulatedRecordArray } = DS;

AdapterPopulatedRecordArray.reopen({

  loadRecords(records, payload) {
    this._super(...arguments);

    let ref = this.ref();
    ref.__update_meta(payload.meta);
    ref.__update_links(payload.links);
  }

});
