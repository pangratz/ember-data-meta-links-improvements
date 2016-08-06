import RecordReference from 'ember-data/-private/system/references/record';

RecordReference.prototype.__update_meta = function(meta) {
  this._meta = meta;
};

RecordReference.prototype.__update_responseMeta = function(meta) {
  this._responseMeta = meta;
};

RecordReference.prototype.meta = function(which) {
  if (which === "response") {
    return this._responseMeta;
  }

  return this._meta;
};
