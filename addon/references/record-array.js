import LinkReference from 'ember-data-meta-links-improvements/references/link';

export default class RecordArrayReference {

  constructor({ store, recordArray }) {
    this.store = store;
    this._recordArray = recordArray;
  }

  value() {
    return this._recordArray;
  }

  meta() {
    return this._meta;
  }

  links(name) {
    if (name) {
      return this._links[name];
    }

    return Object.keys(this._links).map((name) => this[name], this);
  }

  modelName() {
    return this._recordArray.type.modelName;
  }

  __update_meta(meta) {
    this._meta = meta;
  }

  __update_links(links) {
    this._links = {};

    Object.keys(links || {}).forEach((name) => {
      let { href, meta } = links[name];

      href = href || links[name];

      let { store } = this;
      let link = new LinkReference({ parentRef: this, store, name, href, meta  });

      this._links[name] = link;
    });
  }

}
