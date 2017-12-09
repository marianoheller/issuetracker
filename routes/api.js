
'use strict';

var expect = require('chai').expect;
var MongoClient = require('mongodb');
var ObjectId = require('mongodb').ObjectID;

var Issue = require('../models/issue');

const CONNECTION_STRING = process.env.DB; //MongoClient.connect(CONNECTION_STRING, function(err, db) {});



module.exports = function (app) {

  app.route('/api/issues/:project')
  
    .get(function (req, res){
      var project = req.params.project;
      
    })
    
    .post(function (req, res){
      var project = req.params.project;
      const { issue_text, issue_name, created_by } = req.body;
      const { assigned_to, status_text } = req.body;
      if( !issue_text || !issue_name || !created_by ) return res.status(400).send("Not enough parameters");

      var issue = new Issue({
        issue_name: issue_name,
        issue_text: issue_text,
        created_by: created_by,
        assigned_to: assigned_to || "",
        status_text: status_text || ""
      });
      issue.save( (err) => {
        if(err) return res.status(400).send(err.message);
        console.log("SAVED", issue);
        res.json(issue);
      })
    })
    
    .put(function (req, res){
      var project = req.params.project;
      const { _id, issue_name, issue_text, created_by, assigned_to, status_text } = req.body;
      if (!_id) return res.status(400).send("could not update "+ _id);
      Issue.findByIdAndUpdate(_id, {

      })
    })
    
    .delete(function (req, res){
      var project = req.params.project;
      const { _id } = req.body;
      if (!_id) return res.status(400).send( '_id error');
      Issue.findByIdAndRemove(_id, (err, res) => {
        if(err) return res.status(400).send("could not delete "+ _id);
        res.status(200).send( 'deleted '+_id);
      })
    });
    
};
