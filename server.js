var express = require('express');
var app = express();
var bodyParser = require('body-parser');

// set ejs as the view engine
// app.set('view engine', 'ejs');

// load passport module
var passport = require('passport');

// load cookie parsers
var cookieParser = require('cookie-parser');

// load session support
var session      = require('express-session');

// load cors for Cross side scripts
var cors = require('cors');

// configure cookie parser - needed for oauth
app.use(cookieParser());

// configure session support
app.use(session({ secret: 'meanstackisthebest' }));

// initialize passport and session support
app.use(passport.initialize());
app.use(passport.session());

// configure a public directory to host static content
app.use(express.static(__dirname + '/public'));

// install, load, and configure body parser module
app.use(bodyParser.json({type: 'application/json'}));
app.use(bodyParser.urlencoded({
    extended: true
}));

// for aalowing cross side scripting
app.use(cors());

// pass mongojs connection to our server side app
require ("./ide/app.js")(app);

// require ("./uml/app.js")(app);

var ipaddress = process.env.OPENSHIFT_NODEJS_IP;
var port      = process.env.OPENSHIFT_NODEJS_PORT || 3000;

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  next();
});

app.listen(port, ipaddress);
