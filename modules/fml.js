"use strict";

var http = require("http");
var async = require("async");
var util = require("util");
var xml = require("libxmljs-easy");
var fml = function(bot) {
  this.bot = bot;
  
  this.help = {
    description: "A way to find games",
    commands: {
    }
  };
  
  this.extractedData = "";
};

function download(url, callback) {
  var data = "";
  http.get(url, function(res) {
    res.on('data', function (chunk) {
      data += chunk;
    });
    res.on("end", function() {
      callback(data);
    });
  }).on("error", function() {
    callback(null);
  });
}

fml.prototype.commands = {public: {}, private: {}};
fml.prototype.commands.public.random = function(from, to) {
  var extractedData = "";
  var bot = this.bot;

  async.waterfall([
    function(cb) {
      download("http://api.betacie.com/view/random?key=4c86ac96d8241&language=en", function(data) {
        cb(data);
      });
    }
  ], function(data) {var xmlDoc = xml.parse(data);
    xmlDoc = xmlDoc.items[0].item[0];
    var gender = xmlDoc.author.$gender == "none" ? "not human" : (xmlDoc.author.$gender == "man" ? "a male" : "a female")
    bot.say(to, "Posted by " + (xmlDoc.author[0].$.text() ? xmlDoc.author[0].$.text() : "unknown") + " (" + (gender == "not human" ? "no" : "yes") + ", " + (gender == "a female" ? "s" : "") + "he's " + gender + ")" + " from " + (xmlDoc.from[0].$.text() == "mobile" ? "mobile in" : "") + xmlDoc.author.$country);
    bot.say(to, "[ " + xmlDoc.short_url[0].$.text() + " ] " + xmlDoc.text[0].$.text());
  });
}
fml.prototype.global = {};

module.exports = fml;

