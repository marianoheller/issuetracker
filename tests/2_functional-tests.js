/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       (if additional are added, keep them at the very end!)
*/

var chaiHttp = require('chai-http');
var chai = require('chai');
var assert = chai.assert;
var server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {
  this.timeout(5000);
  
    suite('POST /api/issues/{project} => object with issue data', function() {
      
      test('Every field filled in', function(done) {
        const dataSent = {
          issue_title: 'Title',
          issue_text: 'text',
          created_by: 'Functional Test - Every field filled in',
          assigned_to: 'Chai and Mocha',
          status_text: 'In QA'
        };
        chai.request(server)
        .post('/api/issues/test')
        .send( dataSent )
        .end(function(err, res){
          assert.equal(res.status, 200);
          const data = JSON.parse(res.text);
          assert.equal( data.project, "test");
          assert.equal( data.issue_title, dataSent.issue_title);
          assert.equal( data.issue_text, dataSent.issue_text);
          assert.equal( data.created_by, dataSent.created_by);
          assert.equal( data.assigned_to, dataSent.assigned_to);
          assert.equal( data.status_text, dataSent.status_text);
          done();
        });
      });
      
      test('Required fields filled in', function(done) {
        const dataSent = {
          issue_title: 'Title',
          issue_text: 'text',
          created_by: 'Functional Test - Every field filled in'
        };
        chai.request(server)
        .post('/api/issues/test')
        .send( dataSent )
        .end(function(err, res){
          assert.equal(res.status, 200);
          const data = JSON.parse(res.text);
          assert.equal( data.project, "test");
          assert.equal( data.issue_title, dataSent.issue_title);
          assert.equal( data.issue_text, dataSent.issue_text);
          assert.equal( data.created_by, dataSent.created_by);
          done();
        });
      });
      
      test('Missing required fields', function(done) {
        const dataSent = {
          assigned_to: 'Chai and Mocha',
          status_text: 'In QA'
        };
        chai.request(server)
        .post('/api/issues/test')
        .send( dataSent )
        .end(function(err, res){
          assert.equal(res.status, 400);
          assert.equal( res.text , "need required parameters");
          done();
        });
      });
      
    });
    
    suite('PUT /api/issues/{project} => text', function() {
      
      test('No body', function(done) {
        chai.request(server)
        .put('/api/issues/test')
        .send({})
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.equal( res.text , 'no updated field sent');
          done();
        });
      });
      
      test('One field to update', function(done) {
        chai.request(server)
        .post('/api/issues/test')
        .send( {
          issue_title: 'Title',
          issue_text: 'text',
          created_by: 'Functional Test - Every field filled in',
        } )
        .end(function(err, res){
          const data = JSON.parse(res.text);
          const idSaved = data._id;
          chai.request(server)
          .put('/api/issues/test')
          .send({ _id: idSaved, issue_title: "newTitle" })
          .end(function(err, res){
            assert.equal(res.status, 200);
            assert.equal(res.text, "successfully updated");
            done();
          });
        });
      });
      
      test('Multiple fields to update', function(done) {
        this.timeout(5000);
        chai.request(server)
        .post('/api/issues/test')
        .send( {
          issue_title: 'Title',
          issue_text: 'text',
          created_by: 'Functional Test - Every field filled in'
        } )
        .end(function(err, res){
          const data = JSON.parse(res.text);
          const idSaved = data._id;
          chai.request(server)
          .put('/api/issues/test')
          .send({ 
            _id: idSaved, 
            issue_title: "newTitle",
            issue_text: "newText",
            created_by: "newCreator"
          })
          .end(function(err, res){
            assert.equal(res.status, 200);
            assert.equal(res.text, "successfully updated");
            done();
          });
        });
      });
      
    });
    
    suite('GET /api/issues/{project} => Array of objects with issue data', function() {
      
      test('No filter', function(done) {
        chai.request(server)
        .get('/api/issues/test')
        .query({})
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.isArray(res.body);
          assert.property(res.body[0], 'issue_title');
          assert.property(res.body[0], 'issue_text');
          assert.property(res.body[0], 'created_on');
          assert.property(res.body[0], 'updated_on');
          assert.property(res.body[0], 'created_by');
          assert.property(res.body[0], 'assigned_to');
          assert.property(res.body[0], 'open');
          assert.property(res.body[0], 'status_text');
          assert.property(res.body[0], '_id');
          done();
        });
      });
      
      test('One filter', function(done) {
        chai.request(server)
        .get('/api/issues/test')
        .query({
          open: false
        })
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.isArray(res.body);
          assert.property(res.body[0], 'issue_title');
          assert.property(res.body[0], 'issue_text');
          assert.property(res.body[0], 'created_on');
          assert.property(res.body[0], 'updated_on');
          assert.property(res.body[0], 'created_by');
          assert.property(res.body[0], 'assigned_to');
          assert(res.body[0].open == false, 'open');
          assert.property(res.body[0], 'status_text');
          assert.property(res.body[0], '_id');
          done();
        });
      });
      
      test('Multiple filters (test for multiple fields you know will be in the db for a return)', function(done) {
        const params = {
          issue_title: String(Math.random()),
          issue_text: String(Math.random()),
          created_by: String(Math.random())
        };
        chai.request(server)
        .post('/api/issues/test')
        .send( params )
        .end(function(err, res){
          chai.request(server)
          .get('/api/issues/test')
          .query({
            open: false,
            issue_title: 'Title'
          })
          .end(function(err, res){
            assert.equal(res.status, 200);
            assert.isArray(res.body);
            assert(res.body[0].issue_title === 'Title', 'title');
            assert.property(res.body[0], 'issue_text');
            assert.property(res.body[0], 'created_on');
            assert.property(res.body[0], 'updated_on');
            assert.property(res.body[0], 'created_by');
            assert.property(res.body[0], 'assigned_to');
            assert(!res.body[0].open, 'open');
            assert.property(res.body[0], 'status_text');
            assert.property(res.body[0], '_id');
            done();
          });
        })
        
      });
      
    });
    
    suite('DELETE /api/issues/{project} => text', function() {
      
      test('No _id', function(done) {
        chai.request(server)
        .del('/api/issues/test')
        .send({})
        .end(function(err, res){
          assert.equal(res.status, 400);
          assert.equal(res.text, '_id error');
          done();
        });
      });
      
      test('Valid _id', function(done) {
        chai.request(server)
        .post('/api/issues/test')
        .send( {
          issue_title: 'Title',
          issue_text: 'text',
          created_by: 'Functional Test - Every field filled in'
        } )
        .end(function(err, res){
          const data = JSON.parse(res.text);
          const idSaved = data._id;
          chai.request(server)
          .del('/api/issues/test')
          .send({ _id: idSaved })
          .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.text, 'deleted '+ idSaved);
            done();
          });
        });
        
      });
      
    });

});
