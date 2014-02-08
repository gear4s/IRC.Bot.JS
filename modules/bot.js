"use strict";

var bot = function(bot, users) {
  this.users = users;
  this.bot = bot;
  this.help = {
    description: "Admin command interface for the robot",
    commands: {
      quit: {
        admin:true,
        private: false,
        description:"Sends the shutdown signal to the bot"
      },
      version: {
        admin:false,
        private: false,
        description:"Returns the bot version"
      },
      summon: {
        admin:true,
        private: false,
        description:"Makes the bot join a channel"
      },
      banish: {
        admin:true,
        private: false,
        description:"Makes the bot leave a channel"
      }
    }
  };
};
bot.prototype.commands = {public: {}, private: {}};
bot.prototype.commands.public.quit = function(from, _) {
  if(this.users.admin(from) && this.users.status(from) !== 0) {
    this.bot.disconnect("Adios fuckers");
  } else {
    this.bot.notice(from, "Insufficient permissions");
  }
};
bot.prototype.commands.public.version = function(_, to) {
  var os = require('os');
  this.bot.say(to, "Narwhaals v0.3.33; Node.JS " + process.version + " (using V8 v" + process.versions.v8 + process.versions.v8 + ") - Running on " + os.type() + " " + os.arch() + " " + os.release());
};

bot.prototype.commands.public.summon = function(from, to, channel) {
  if(!this.users.admin(from) || this.users.status(from) === 0) {
    this.bot.notice(from, "Insufficient permissions");
    return false;
  }

  this.bot.join(channel);
}

var makeReadable = function(bytes, precision) {  
  var kilobyte = 1024;
  var megabyte = kilobyte * 1024;
  var gigabyte = megabyte * 1024;
  var terabyte = gigabyte * 1024;
   
  if ((bytes >= 0) && (bytes < kilobyte)) {
    return bytes + ' B';
  } else if ((bytes >= kilobyte) && (bytes < megabyte)) {
    return (bytes / kilobyte).toFixed(precision) + ' KB';
  } else if ((bytes >= megabyte) && (bytes < gigabyte)) {
    return (bytes / megabyte).toFixed(precision) + ' MB';
  } else if ((bytes >= gigabyte) && (bytes < terabyte)) {
    return (bytes / gigabyte).toFixed(precision) + ' GB';
  } else if (bytes >= terabyte) {
    return (bytes / terabyte).toFixed(precision) + ' TB';
  } else {
    return bytes + ' B';
  }
}
bot.prototype.commands.public.stats = function(_, to) {
  var minutes = parseInt(Math.floor(process.uptime() / 60));
  var seconds = parseInt(process.uptime() - minutes * 60);
  var hours = parseInt(Math.floor(process.uptime() / 3600));
  
  this.bot.say(to, "RAM being used: " + makeReadable(process.memoryUsage().heapUsed, 2) + " out of " + makeReadable(process.memoryUsage().heapTotal, 2) + " - Uptime: " + hours + "h " + minutes + "m " + seconds + "s");
}

bot.prototype.commands.public.banish = function(from, to, channel) {
  if(!this.users.admin(from) || this.users.status(from) === 0) {
    this.bot.notice(from, "Insufficient permissions");
    return false;
  }
  
  this.bot.part(channel, "Adios fuckers");
}

module.exports = bot;
