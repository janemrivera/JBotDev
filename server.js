'use strict';

var Flint = require('node-flint');
var webhook = require('node-flint/webhook');
var express = require('express');
var bodyParser = require('body-parser');
var request = require('request');
var Imgflipper = require('imgflipper');

var http = require('http');

var app = express();
app.use(bodyParser.json());
//const config = require("./config.json");

var config = {
  "webhookUrl": process.env.WEBHOOKURL,
  "token": process.env.BOTTOKEN,
  "port": process.env.PORT
}

// init flint
var flint = new Flint(config);
flint.start();
console.log("Starting flint, please wait...");

flint.on("initialized", function() {
  console.log("Flint initialized successfully! [Press CTRL-C to quit]");
});


/****
##  add flint event listeners
****/
flint.on('message', function(bot, trigger, id) {
  flint.debug('"%s" said "%s" in room "%s"', trigger.personEmail, trigger.text, trigger.roomTitle);
});

//Welcome message when a new room or 1:1 is spawned with the bot
flint.on('spawn', function(bot) {
  //flint.debug('new bot spawned in room: %s', bot.room.title);
  console.log('new bot spawned in room: %s', bot.room.title);
  //presents different messages based on room or 1:1
  //console.log(bot.membership);
  if(bot.isGroup){
     //bot.say("Hi! To get started just type @Ferb /hello. \n\n\n **Note that this is a 'Group' room. I will wake up only when mentioned.**");
  }else{
    //bot.say("Hi! To get started just type hello.");
  };
  //bot.repeat;
});

//does not work the first call; triggers when i readd the bot to the same room
flint.on("personEnters", function(bot, person, id) {
	flint.debug('personEnters event in room: "%s"', bot.room.title);

  //presents different messages based on room or 1:1
  if(bot.isGroup){
     bot.say("Hi! To get started just type @Ferb /hello. \n\n\n **Note that this is a 'Group' room. I will wake up only when mentioned.**");
  }else{
    bot.say("Hi! To get started just type hello.");
  };
  bot.repeat;
});

flint.on("membershipCreated", function(membership, id) {

	flint.debug('membershipCreated event in room: "%s" for "%s"', membership.roomId, membership.personEmail);

});

flint.on("membershipDeleted", function(membership, id) {

	flint.debug('membershipCreated event in room: "%s" for "%s"', membership.roomId, membership.personEmail);

});

flint.on('personExits', function(bot) {
	flint.debug('bot left room: "%s"', bot.room.title);
});


flint.on('despawn', function(bot) {
	flint.debug('bot despawned in room: "%s"', bot.room.title);
});



/****************************************
## Process incoming messages
****************************************/

/* On mention with command
ex User enters @botname /hello, the bot will write back
*/
flint.hears('/help', function(bot, trigger) {
  console.log("/help fired");
  var outputString = "I can give you quick access to the available commands:\n- /about\n- /help\n- /hi\n- /hello \n- /room: reveals this room identifier\n- /whoami: shows your spark info\n- /whois @mention: learn about other participants\n"
   bot.say("markdown", outputString);
});


flint.hears('/about', function(bot, trigger) {
  console.log("/about fired");
  var outputString = "```\n{\n  'author':'Jane Rivera &lt;jmrivera@nalco.com&gt;',\n  'code':'helloworld.js on local',\n  'description':'a test bot for checking out the Spark APIs',\n  'healthcheck':'GET https://www.test.com',\n  'webhook':'POST https://www.test.com'\n}\n```"
   bot.say("markdown", outputString);
});

flint.hears('/hello', function(bot, trigger) {
  console.log("/hello fired");
  bot.say('%s, you said hello to me!', trigger.personDisplayName);
});

flint.hears('/hi', function(bot, trigger) {
  console.log("/hi fired");
  bot.say('Hi %s! How are you today?', trigger.personDisplayName);
});

/*
ex "@botname /whoami"
*/
flint.hears('/whoami', function(bot, trigger) {
  console.log("/whoami fired");
  //the "trigger" parameter gives you access to data about the user who entered the command
  var roomId = "*" + trigger.roomId + "*";
  var roomTitle = "**" + trigger.roomTitle + "**";
  var personEmail = trigger.personEmail;
  var personDisplayName = trigger.personDisplayName;
  var outputString = "${personDisplayName} here is some of your information: \n\n\n **Room:** you are in &ldquo;${roomTitle}&rdquo; \n\n\n **Room id:** ${roomId} \n\n\n **Email:** your email on file is *${personEmail}*";
  bot.say("markdown", outputString);
});


/****************************************
## Handler for unknown commands
****************************************/
// default message for unrecognized commands
flint.hears(/.*/, function(bot, trigger) {
  console.log("Unknown command fired.");
  bot.say('You see a shimmering light, but it is growing dim...');
}, 20);





/****
## Server config & housekeeping
****/

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
http.createServer(function (req, res) {

    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end('Hello, world!');

}).listen(process.env.PORT || 8080);
*/
