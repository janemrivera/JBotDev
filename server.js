'use strict';

var Flint = require('node-flint');
var webhook = require('node-flint/webhook');
var express = require('express');
var bodyParser = require('body-parser');
var request = require('request');
var Imgflipper = require('imgflipper');

var http = require('http');

var app = express();
// Setup the View Engine
//app.set("view engine", "jade");
//app.engine("ejs", ejsEngine); // support master pages
//app.set("view engine", "ejs"); // ejs view engine
//app.set("view engine", "vash");

// Opt into Services
//app.use(express.urlencoded());
//app.use(express.cookieParser());
//app.use(express.session({ secret: "PluralsightTheBoard" }));
//app.use(flash());

// set the public static resource folder
app.use(express.static(__dirname + "/public"));

app.use(bodyParser.json());
//const config = require("./config.json");

var config = {
  "webhookUrl": process.env.WEBHOOKURL,
  "token": process.env.BOTTOKEN,
  "port": process.env.PORT
}


/****
## Server config & housekeeping
****/
app.get('/', function(req, res){
    res.send('Hello World');
});

app.get('/health', function(req, res){
    res.send('OK');
});

app.get("/api/users", function (req, res) {
  res.set("Content-Type", "application/json");
  res.send({ name: "Jane", isValid: true, group: "Admin" });
});

// define express path for incoming webhooks
app.post('/', webhook(flint));

// start express server
var server = app.listen(config.port, function () {
  flint.debug('Flint listening on port %s', config.port);
});

// gracefully shutdown (ctrl-c)
process.on('SIGINT', function() {
  flint.debug('stopping...');
  server.close();

  flint.stop().then(function() {
    process.exit();
  });

});




/*
var http = require('http');

http.createServer(function (req, res) {

    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end('Hello, world!');

}).listen(process.env.PORT || 8080);
*/
