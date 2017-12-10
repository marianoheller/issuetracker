
'use strict';

var expect = require('chai').expect;
var MongoClient = require('mongodb');
var ObjectId = require('mongodb').ObjectID;

var Issue = require('../models/issue');

const CONNECTION_STRING = process.env.DB; //MongoClient.connect(CONNECTION_STRING, function(err, db) {});



module.exports = function (app) {

  app.route('/api/issues/:project')
  
    .get(function (req, res){
      var { project } = req.params;
      var { open } = req.query;
      const query = open ? { project: project, open: open } : { project: project };
      Issue.find(query, (err, issues) => {
        if(err) return res.status(400).send(err.message);
        return res.json(issues);
      })
    })
    
    .post(function (req, res){
      var project = req.params.project;
      const { issue_text, issue_title, created_by } = req.body;
      const { assigned_to, status_text } = req.body;
      if( !issue_text || !issue_title || !created_by ) return res.status(400).send("need required parameters");
      var issue = new Issue({
        project: project,
        issue_title: issue_title,
        issue_text: issue_text,
        created_by: created_by,
        assigned_to: assigned_to || "",
        status_text: status_text || ""
      });
      issue.save( (err) => {
        if(err) return res.status(400).send(err.message);
        res.json(issue);
      })
    })
    
    .put(function (req, res){
      var project = req.params.project;
      const { _id, issue_title, issue_text, created_by, assigned_to, status_text } = req.body;
      if( !issue_title && !issue_text && !created_by && !assigned_to && !status_text ) return res.status(200).send('no updated field sent');
      if (!_id) return res.status(400).send("could not update "+ _id);
      Issue.findById(_id, (err, issue) => {
        if(err) return res.status(400).send("could not update "+ _id);
        if( issue_title ) issue.issue_title = issue_title;
        if( issue_text ) issue.issue_text = issue_text;
        if( created_by ) issue.created_by = created_by;
        if( assigned_to ) issue.assigned_to = assigned_to;
        if( status_text ) issue.status_text = status_text;
        issue.save( (error) => {
          if(error) return res.status(400).send("could not update "+ _id);
          return res.status(200).send("successfully updated");
        });
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
