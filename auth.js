"use strict";

var auth = function(userlist) {
  this.userlist = userlist;
  this.loggedin = [];
  this.loggedinid = [];
};

auth.prototype.login = function(ircid, user, sequence) {
  if(!this.userlist[user]) {
    console.log("[ ERROR ] Invalid user");
  } else if(this.loggedin[user]) {
    console.log("[ WARNING ] User already logged in");
  } else if(sequence == this.userlist[user][1]) {
    this.loggedinid[ircid] = user;
    return true;
  } else {
    console.log("[ SECURITY ERROR ] Invalid password!");
  }
  return false;
};

auth.prototype.logout = function(ircid) {
  if(!this.loggedinid[ircid]) {
    console.log("[ WARNING ] User not logged in");
  } else {
    this.loggedin[this.loggedinid[ircid]] = null;
    this.loggedinid[ircid] = null;
  }
};

auth.prototype.update = function(ircid, newircid) {
  if(!this.loggedinid[ircid]) {
    console.log("[ WARNING ] User not logged in");
  } else {
    this.loggedinid[newircid] = this.loggedinid[ircid];
    this.loggedinid[ircid] = null;
  }
};

auth.prototype.admin = function(ircid) {
  if(!this.loggedinid[ircid]) {
    console.log("[ ERROR ] Invalid user");
  } else if(!this.userlist[this.loggedinid[ircid]]) {
    
  } else {
    return this.userlist[this.loggedinid[ircid]][0] == 2;
  }
};

auth.prototype.status = function(ircid) {
  if(!this.loggedinid[ircid]) {
    console.log("[ ERROR ] Invalid user");
  } else {
    return !(!this.loggedinid[ircid]);
  }
};

module.exports = auth;

