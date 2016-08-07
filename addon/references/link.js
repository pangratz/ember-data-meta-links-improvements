export default class LinkReference {

  constructor({ store, parentRef, name, href, meta }) {
    this._store = store;
    this._parentRef = parentRef;
    this._name = name;
    this._href = href;
    this._meta = meta;
  }

  name() {
    return this._name;
  }

  href() {
    return this._href;
  }

  meta() {
    return this._meta;
  }

  parentRef() {
    return this._parentRef;
  }

  load() {
    return this._store.loadLink(this);
  }

}
