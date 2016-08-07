import DS from "ember-data";

const { RESTAdapter } = DS;

RESTAdapter.reopen({

  findLink(link) {
    return this.ajax(link, "GET");
  }

});
