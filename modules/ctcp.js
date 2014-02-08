"use strict";

var ctcp = function(bot) {
  this.help = {
    description: "CTCP replies"
  }
  var replies = {
    version: "VERSION Narwhaals v0.3.33; Node.JS " + process.version + " (using V8 v" + process.versions.v8 + ")"
  };
  bot.addListener("ctcp", function (from, to, text) {
    if(({action: true})[text.split(" ")[0].toLowerCase()]) {
      return false;
    }
    bot.notice(from, replies[text.toLowerCase()] || "Invalid CTCP code");
  });
};

module.exports = ctcp;

