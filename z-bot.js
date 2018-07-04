"use strict";

process.title = 'Pushup Ziggurat Bot';
const version = '1.0 | 07/04/18 1:00 PM EST';
const version_notes = "Hello world! Type #pushup to count 10 pushups. Custom number coming soon! Created by BitBruce ♡";
const commands = "Commands: \n- #pushup\n- help";
//TODO: Custom count, varied responses

require('dotenv').config(); // Pulls env variables from hidden `.env` file

const Discord = require('discord.js');
const discordClient = new Discord.Client();
const Data = require('./z-data.js');

const prefix = '#'; // User input symbol
const msg_prefix = 'Ziggurat Bot: '; // outgoing message prefix
const msg_intro = '\n\n======= Ziggurat Bot Starting =======\n\n';
const msg_disconnect = '\n\n======= Ziggurat Bot Disconnecting =======\n\n';
const msg_error = '\nE R R O R : ';

const debug = false;

var bot;

/* Discord Client Functions */

// On ready
discordClient.on('ready', () => {
  console.log(msg_intro + msg_prefix + 'I am ready!');
  bot = discordClient.user;
});

// On disconnect
discordClient.on('disconnect', event => {
  var msg = msg_prefix;

  if (event.reason === 'Authentication failed.') {
    msg += event.reason + ' Supply api token in `.env`.';
  } else {
    if (debug) {
    msg += 'Client disconnected. Reason: ' + event.reason + '\n' +  event;
    } else {
      msg += 'Client disconnected. Reason: ' + event.reason;
    }
  }

  console.log(msg + msg_disconnect);
});

// On error
discordClient.on('error', error => {
  console.log(msg_prefix + msg_error + error.reason);
  process.exit(1);
});

// On message
discordClient.on('message', function(message) {
  if (message.author.bot) {
    // Prevent the bot from talking to itself!
  } else if (message.content.startsWith(prefix)) {
    // console.log('Trimmed message: ' + trimMsg(message.content));
    processMessage(message);
  } else if (message.content == 'prefix' || message.content == 'help') {
    message.reply('The message prefix for the bot is: ' + prefix);
  } else {

  }
});

/* Action functions */

var pushupCounter = function(message) {
  let user = message.author.username;
  let count = 10; //TODO: find the argument number

  let times = Data.updatePushupCount(user, count);
  console.log("Times: " + times);
  message.reply("Way to go! You've pushed up " + times + " times.");
}

var getDataDump = function() {
  Data.getDataDump();
}

/* Utility functions */

var trimMsg = function(msg) {
  return (msg.substring(prefix.length)).trim(); // Trim the post-prefix message
};

var processMessage = function(message) {
  var msg = trimMsg(message.content);
  if (msg == 'ping') {
    message.reply('pong!');
  } else if (msg == 'help' || msg == 'commands') {
    message.reply(commands);
  } else if (msg == 'version') {
    message.reply('Version: ' + version + '. Version notes: ' + version_notes);
  } else if (msg.startsWith('pushup')) {
    pushupCounter(message);
  } else if (msg.startsWith('pushupdatadump')) {
    message.reply(getDataDump());
  } else {
    // Do something with message. Maybe pass it to Dialogflow.
  }
};

/* Test */
var testPushupCount = function() {
  Data.updatePushupCount('bruce', 10)
  Data.updatePushupCount('luke', 7)
  Data.getDataDump();
}

/* Main */
var initialize = function() {
  console.log('Connecting...');
  discordClient.login(process.env.DISCORD_TOKEN);
  // testPushupCount();
};

(function() {
  initialize();
})();
