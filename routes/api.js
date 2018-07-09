
'use strict';

var expect = require('chai').expect;
var MongoClient = require('mongodb');
var ObjectId = require('mongodb').ObjectID;

var Issue = require('../models/issue');

const CONNECTION_STRING = process.env.DB; //MongoClient.connect(CONNECTION_STRING, function(err, db) {});



module.exports = function (app) {

  app.route('/api/issues/:project')
  
    .get(function (req, res){
      const { project } = req.params;
      Issue.find({
        project,
        ...req.query,
      }, (err, issues) => {
        if(err) return res.status(400).send(err.message);
        return res.json(issues);
      })
    })
    
    .post(function (req, res){
      const { project } = req.params;
      const { 
        issue_text,
        issue_title,
        created_by,
        assigned_to,
        status_text,
      } = req.body;
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
      const { project } = req.params;
      const { body } = req;
      const objKeys = [
        'issue_title',
        'issue_text',
        'created_by',
        'assigned_to',
        'status_text',
      ];
      if (objKeys.every( k => !body[k])) return res.status(200).send('no updated field sent');
      if (!body._id) return res.status(400).send("could not update "+ body._id);
      Issue.findByIdAndUpdate(body._id, { ...body }, (error, issue) => {
        if(error) return res.status(400).send("could not update "+ body._id);
        return res.status(200).send("successfully updated");
      });
    })
    
    .delete(function (req, res){
      const { project } = req.params;
      const { _id } = req.body;
      if (!_id) return res.status(400).send( '_id error');
      Issue.findByIdAndRemove(_id, (err) => {
        if(err) return res.status(400).send("could not delete "+ _id);
        res.status(200).send( 'deleted '+_id);
      })
    });
    
};
