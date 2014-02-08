"use strict";

var bot = function(bot, users) {
  this.users = users;
  this.bot = bot;
  this.help = {
    description: "Admin command interface for the robot",
    commands: {
      kick: {
        admin:true,
        private: false,
        description:"Kicks a user from a channel"
      },
      user: {
        admin:true,
        private: false,
        description:"Gives a user operator status"
      },
      voice: {
        admin:true,
        private: false,
        description:"Gives a user permission to talk in a moderated channel"
      },
      de: {
        admin:true,
        private: false,
        description:"Revokes a user operator status"
      },
      devoice: {
        admin:true,
        private: false,
        description:"Revokes a user's permission to talk in a moderated channel"
      },
      topic: {
        admin:true,
        private: false,
        description:"Change the channel topic"
      },
    }
  };
};
bot.prototype.commands = {public: {}, private: {}};
bot.prototype.commands.public.kick = function(from, to, who, channel) {
  if(this.users.admin(from) && this.users.status(from) !== 0) {
    if(!this.bot.isop[to]) {this.bot.say(to, "I need to be op to kick"); return 0;}
    if(!who) {
      this.bot.say(to, "User needs to be there nigg");
      return false;
    }
    channel = channel || "";
    var l = channel[0] == "#" ? 1 : 0;
    var reason = "";
    for (var i = 3+l; i < arguments.length; i++){
      reason += arguments[i] + ' ';
    }
    this.bot.say(to, "Kicked " + who + " - Reason: " + reason);
    this.bot.send("KICK", l == 1 ? channel : to, who);
  } else {
    this.bot.say(to, "You're not admin");
  }
};
bot.prototype.commands.public.voice = function(from, to, who, channel) {
  if(this.users.admin(from) && this.users.status(from) !== 0) {
    if(!this.bot.isop[to]) {this.bot.say(to, "I need to be op to voice"); return 0;}
    if(!who) {
      this.bot.say(to, "User needs to be there nigg");
      return false;
    }
    channel = channel || "";
    var l = channel[0] == "#" ? 1 : 0;
    this.bot.say(to, "Voiced " + who);
    this.bot.send("MODE", l == 1 ? channel : to, "+v", who);
  } else {
    this.bot.say(to, "You're not admin");
  }
};
bot.prototype.commands.public.devoice = function(from, to, who, channel) {
  if(this.users.admin(from) && this.users.status(from) !== 0) {
    if(!this.bot.isop[to]) {this.bot.say(to, "I need to be op to voice"); return 0;}
    if(!who) {
      this.bot.say(to, "User needs to be there nigg");
      return false;
    }
    channel = channel || "";
    var l = channel[0] == "#" ? 1 : 0;
    this.bot.say(to, "Devoiced " + who);
    this.bot.send("MODE", l == 1 ? channel : to, "-v", who);
  } else {
    this.bot.say(to, "You're not admin");
  }
};
bot.prototype.commands.public.user = function(from, to, who, channel) {
  if(this.users.admin(from) && this.users.status(from) !== 0) {
    if(!this.bot.isop[to]) {this.bot.say(to, "I need to be op to op"); return 0;}
    if(!who) {
      this.bot.say(to, "User needs to be there nigg");
      return false;
    }
    channel = channel || "";
    var l = channel[0] == "#" ? 1 : 0;
    this.bot.say(to, "Opped " + who);
    this.bot.send("MODE", l == 1 ? channel : to, "+o", who);
  } else {
    this.bot.say(to, "You're not admin");
  }
};
bot.prototype.commands.public.de = function(from, to, who, channel) {
  if(this.users.admin(from) && this.users.status(from) !== 0) {
    if(!this.bot.isop[to]) {this.bot.say(to, "I need to be op to op"); return 0;}
    if(!who) {
      this.bot.say(to, "User needs to be there nigg");
      return false;
    }
    channel = channel || "";
    var l = channel[0] == "#" ? 1 : 0;
    this.bot.say(to, "Deopped " + who);
    this.bot.send("MODE", l == 1 ? channel : to, "-o", who);
  } else {
    this.bot.say(to, "You're not admin");
  }
};
bot.prototype.commands.public.topic = function(from, to) {
  if(this.users.admin(from) && this.users.status(from) !== 0) {
    if(!this.bot.isop[to]) {this.bot.say(to, "I need to be op to change the t-op-ic"); return 0;}
    var reason = "";
    for (var i = 2; i < arguments.length; i++){
      reason += arguments[i] + ' ';
    }
    this.bot.send("TOPIC", to, reason);
  } else {
    this.bot.say(to, "You're not admin");
  }
};

bot.prototype.global = {};

module.exports = bot;


