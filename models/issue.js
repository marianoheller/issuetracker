// grab the things we need
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

mongoose.Promise = global.Promise;

// create a schema
var issueSchema = new Schema({
  project: { type: String, required: true },
  issue_title: { type: String, required: true },
  issue_text: { type: String, required: true },
  created_by: { type: String, required: true },
  assigned_to: { type: String },
  status_text: { type: String },

  created_on: { type: Date },
  updated_on: { type: Date },
  open: { type: Boolean },
});


issueSchema.pre('update', function(next) {
  this.updated_on = new Date();
  next();
});

issueSchema.pre('save', function(next) {
  const now = new Date();
  this.created_on = now;
  this.updated_on = now;
  this.open = false;
  next();
});

issueSchema.post('save', function(doc) {
  console.log('%s has been saved', doc._id);
});

issueSchema.post('update', function(doc) {
  console.log('%s has been updated', doc._id);
});

var Issue = mongoose.model('Issue', issueSchema);


module.exports = Issue;