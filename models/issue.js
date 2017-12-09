// grab the things we need
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

mongoose.Promise = global.Promise;

// create a schema
var issueSchema = new Schema({
  issue_name: { type: String, required: true },
  issue_text: { type: String, required: true },
  created_by: { type: String, required: true },
  assigned_to: { type: String },
  status_text: { type: String },

  created_on: { type: Date, required: true, default: new Date() },
  updated_on: { type: Date, required: true, default: new Date() },
  open: { type: Boolean, required: true, default: false },
});


issueSchema.pre('update', function(next) {
    this.updated_on = new Date();
    next();
});


var Issue = mongoose.model('Issue', issueSchema);


module.exports = Issue;