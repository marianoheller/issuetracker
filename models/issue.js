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

  created_on: { type: Date, required: true, default: Date.now() },
  updated_on: { type: Date, required: true, default: Date.now() },
  open: { type: Boolean, required: true, default: false },
});


var Issue = mongoose.model('Issue', issueSchema);


module.exports = Issue;