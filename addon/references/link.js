export default class LinkReference {

  constructor({ store, name, href, meta }) {
    this._store = store;
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

}
