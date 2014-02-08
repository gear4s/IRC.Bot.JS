"use strict";

var match = function(bot) {
  this.matches = {};
  this.requested = {};
  this.bot = bot;
  
  this.help = {
    description: "A way to find games",
    commands: {
      request: {
        admin: false,
        private: false,
        description: "Broadcasts a message that you are looking for players to play a match",
        args: [[true, "type"], [true, "players_have"], [true, "serverip"], [true, "serverport"]],
        example: ["3x3", "4", "sauerleague.org", "20000"]
      },
      status: {
        admin: false,
        private: false,
        description: "Prints status of all current queued events",
        args: []
      },
      cancel: {
        admin: true,
        private: false,
        description: "Cancels an event. Note that you have to be the event creator to cancel",
        args: [[true, "id"]]
      },
      available: {
        admin: false,
        private: false,
        description: "Signs you up for an event. Note that when an event is complete, you are deregistered for others",
        args: [[true, "id"]]
      }
    }
  };
};
match.prototype.commands = {public: {}, private: {}};
match.prototype.commands.public.request = function(req, to, type, p, ip, port) {
  var mp;
  
  if(this.requested[req]) {
    this.bot.notice(req, "Your match is already on the waiting list");
    return false;
  }
  
  switch(type) {
    case "1x1": case "duel": type = "duel"; mp = 2; break;
    case "2x2": mp = 4; break;
    case "3x3": mp = 6; break;
    case "4x4": mp = 8; break;
    default: this.bot.notice(req, "Invalid type; valid types are: 1x1 2x2 3x3 4x4"); return false;
  }
  
  if(!p || mp < p) {
    this.bot.notice(req, "Invalid players needed");
     return false;
  }
  
  if(!p.match("^[0-9]$")) {
    this.bot.notice(req, "Invalid players needed");
     return false;
  }
  
  if(!ip || !port) {
    this.bot.notice(req, "Invalid server");
    return false;
  }
  
  var t = this;
  var m = function() {
    var l = require('randomstring');
    l = l(5);
    if(!t.matches[l]) {
      return l;
    } else {
      return m();
    }
  };
  var id = m();
  this.matches[id] = [req, type, ip, port, mp - p, []];
  this.requested[req] = true;
  for (var i = 0; i < this.bot.opt.channels.length; i++) { 
    this.bot.say(this.bot.opt.channels[i], "[" + id + "] " + req + " is looking for a " + type + " on " + ip + ":" + port + " (" + (mp - p) + " player" + (mp - p == 1 ? '' : 's') + " required)");
  }
  this.bot.notice(req, "Request sent");
};

match.prototype.commands.public.available = function(from, _, key) {
  var s = this.matches;
  if(s[key]) {
    if(s[key][5][from] || s[key][0] == from) {
      this.bot.notice(from, "You are already queued up for that event");
      return false;
    }
    this.matches[key][4] -= 1;
    this.matches[key][5][from] = true;
    if(this.matches[key][4] == 0) {
      for (var i in this.bot.opt.channels) {
        this.bot.say(this.bot.opt.channels[i], "[" + key + "] Player limit reached for " + s[key][0] + "'s match");
      }
      this.requested[from] = false;
      for(var name in this.matches[key][5]) {
        this.bot.notice(name, "[" + key + "] You have been removed from all other queues; please connect to: " + s[key][2] + ":" + s[key][3]);
      }
      var s = this.matches[key][5];
      for(var m in this.matches) {
        for(var name in s) {
          if(this.matches[m][5][name]) this.matches[m][5][name] = false;
        }
      }
      this.matches[key] = null;
    } else {
      for (var i in this.bot.opt.channels) {
        this.bot.say(this.bot.opt.channels[i], "[" + key + "] " + from + " has signed up for " + s[key][0] + "'s match (" + s[key][4] + " player" + (s[key][4] == 1 ? '' : 's') + " required)");
      }
    }
  } else {
    this.bot.notice(from, "Invalid match ID");
  }
};

match.prototype.commands.public.status = function(_, to) {
  var s = this.matches;
  var f = false;
  for(var key in s) {
    if(s[key]) {
      this.bot.say(to, "[" + key + "] " + s[key][0] + " is looking for a " + s[key][1] + " (" + s[key][4] + " player" + (s[key][4] == 1 ? '' : 's') + " required)");
      f = true;
    }
  }
  if(!f) {this.bot.say(to, "No matches requested");}
};

match.prototype.commands.public.cancel = function(from, to, key) {
  if(this.matches[key]) {
    if(this.matches[key][0] == from) {
      this.matches[key] = null;
      this.requested[from] = false;
      this.bot.say(to, "Request cancelled");
    } else {
      this.bot.say(to, "You are not the creator of the event, therefore have no permission here");
    }
  }
};

match.prototype.update = function(on, nn) {
  for(var m in this.matches) {
    if(this.matches[m][0] == on) {
      this.matches[m][0] = nn;
    } else if(this.matches[m][5][on]) {
      this.matches[m][5][on] = false;
      this.matches[m][5][nn] = true;
    }
  }
};

match.prototype.global = {};
match.prototype.global.match = match.prototype.commands.public.request;

module.exports = match;

