"use strict";

var logger = function(bot) {
  this.help = {
    description: "Logs your conversations, BY CREEPED"
  }

  var fs = require("fs");
  
  function getDateTime() {
    var date = new Date();
    
    function b0(i) {return (i < 10 ? "0" : "") + i}
    var hour = b0(date.getHours());
    var min  = b0(date.getMinutes());
    var sec  = b0(date.getSeconds());
    var year = b0(date.getFullYear());
    var month = b0(date.getMonth() + 1);
    var day = b0(date.getDate());
  
    return day + "/" + month + "/" + year + " " + hour + ":" + min + ":" + sec;
  }
  
  function log(where, what, msg) {
    var p = './modules/logs/'+where+'/' + what + '.log';
    fs.appendFile(p, "[" + getDateTime() + "] " + msg + "\n", function (err) {});
  }
  
  bot.addListener("message#", function(from, to, texto) {
    log("channel", to, "<" + from + "> " + texto);
  });
  
  bot.addListener("join", function (channel, who) {
    // Welcome them in!
    if(who == bot.opt.nick) {
      log("channel", channel, "Joined channel");
    } else {
      log("channel", channel, who + " joined channel");
    }
  });
  
  bot.addListener("part", function (channel, who) {
    // Welcome them in!
    if(who == bot.opt.nick) {
      log("channel", channel, "Left channel");
    } else {
      log("channel", channel, who + " left channel");
    }
  });
  
  bot.addListener("pm", function(from, texto) {
    log("private", from, "<" + from + "> " + texto);
  });

  bot.addListener("registered", function (message) {
    log("server", "server", "Connected");
  });

  bot.addListener("ctcp", function (from, to, text) {
    log(to[0] == "#" ? "channel" : "private", to[0] == "#" ? to : from, to[0] == "#" ? (text.split(" ")[0] == "ACTION" ? " * " + from + " " + text.substr(text.indexOf(" ") + 1) : "CTCP " + from + " " + text) : "{recieved a CTCP " + text + "}");
  });
};

module.exports = logger;

