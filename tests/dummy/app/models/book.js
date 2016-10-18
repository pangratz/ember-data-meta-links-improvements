import DS from "ember-data";

const { Model, belongsTo, hasMany } = DS;

export default Model.extend({
  author: belongsTo(),
  chapters: hasMany()
});
