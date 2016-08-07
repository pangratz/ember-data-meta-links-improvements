import DS from "ember-data";
import RecordArrayReference from "../references/record-array";

const { RecordArray } = DS;

RecordArray.reopen({

  init() {
    this._super(...arguments);

    let { store } = this;
    this._ref = new RecordArrayReference({ recordArray: this, store });
  },

  ref() {
    return this._ref;
  }

});
