import BelongsToReference from 'ember-data/-private/system/references/belongs-to';

BelongsToReference.prototype.parentRef = function() {
  return this.internalModel.recordReference;
}
