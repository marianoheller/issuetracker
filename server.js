'use strict';
require('dotenv').config()
var express     = require('express');
var bodyParser  = require('body-parser');
var expect      = require('chai').expect;
var cors        = require('cors');
var helmet = require('helmet')
var mongoose = require('mongoose');

var apiRoutes         = require('./routes/api.js');
var fccTestingRoutes  = require('./routes/fcctesting.js');
var runner            = require('./test-runner');

var app = express();

app.use('/public', express.static(process.cwd() + '/public'));

app.use(helmet.xssFilter());
app.use(cors({origin: '*'})); //For FCC testing purposes only

mongoose.Promise = global.Promise;
mongoose.connect(process.env.DB_URL,{
  useNewUrlParser: true,
  socketTimeoutMS: 10000,
}).then(
  () => { console.log("Connected to DB succesfully!") },
  err => { console.log("Error connecting to the DB.", err.message); }
);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//Sample front-end
app.route('/:project/')
  .get(function (req, res) {
    res.sendFile(process.cwd() + '/views/issue.html');
  });

//Index page (static HTML)
app.route('/')
  .get(function (req, res) {
    res.sendFile(process.cwd() + '/views/index.html');
  });

//For FCC testing purposes
fccTestingRoutes(app);

//Routing for API 
apiRoutes(app);  
    
//404 Not Found Middleware
app.use(function(req, res, next) {
  res.status(404)
    .type('text')
    .send('Not Found');
});

//Start our server and tests!
app.listen(process.env.PORT || 3000, function () {
  console.log("Listening on port " + (process.env.PORT || 3000));
  if(process.env.NODE_ENV && process.env.NODE_ENV.trim()==='test') {
    console.log('Running Tests...');
    setTimeout(function () {
      try {
        runner.run();
      } catch(e) {
        var error = e;
          console.log('Tests are not valid:');
          console.log(error);
      }
    }, 3500);
  }
});

module.exports = app; //for testing


//Import the mongoose module


//Set up default mongoose connection

// Get Mongoose to use the global promise library

