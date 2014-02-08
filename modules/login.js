"use strict";

var login = function(bot, user) {
  this.bot = bot;
  this.users = user;
  this.help = {
    description: "Login to the userlist",
    commands: {
      login: {
        admin:false,
        private: true,
        description:"Authenticates you as admin"
      }
    }
  };
};

login.prototype.commands = {public: {}, private: {}};
login.prototype.commands.private.login = function(from, sequence, id) {
  if(this.users.login(from, id || from, sequence)) {
    this.bot.notice(from, "Authentication succeeded.");
  } else {
    this.bot.notice(from, "Authentication failed; possible reasons: invalid username, invalid password, already logged in");
  }
};

module.exports = login;
