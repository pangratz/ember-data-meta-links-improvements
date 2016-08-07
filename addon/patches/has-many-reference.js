import HasManyReference from 'ember-data/-private/system/references/has-many';
import LinkReference from 'ember-data-meta-links-improvements/references/link';

HasManyReference.prototype.links = function(name) {
  if (name) {
    return this._links[name];
  }

  return Object.keys(this._links).map((name) => this[name], this);
};

HasManyReference.prototype.__update_links = function(links) {
  this._links = {};

  Object.keys(links || {}).forEach((name) => {
    let { href, meta } = links[name];

    href = href || links[name];

    let { store } = this;

    let link = new LinkReference({ parentRef: this, store, name, href, meta  });

    this._links[name] = link;
  });
};

HasManyReference.prototype.modelName = function() {
  return this.type;
}
