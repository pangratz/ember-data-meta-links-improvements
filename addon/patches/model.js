import DS from "ember-data";

DS.Model.reopen({
  ref() {
    let modelName = this.constructor.modelName;
    return this.store.getReference(modelName, this.id);
  }
});
