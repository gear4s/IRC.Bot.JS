"use strict";

var cmd = function(bot) {
  this.bot = bot;
  this.glob = {};
  
  this.cCmd = function(module, name, plugins) {
    if(plugins[module].commands) {if(plugins[module].commands.public[name]) {return false;}}
    return true;
  };
};

cmd.prototype.loadModule = function(name, bot, user, userarray) {
  /*try {*/
    var P = require('./modules/' + name);
    P = new P(bot, user, userarray);

    if(!P.help) {
      console.log("[ ERROR ] Module " + name + " has no help object, not loading module");
      return false;
    }

    if(P.global) {
      for(var i in P.global) {
        this.glob[i] = [name, P.global[i]];
      }
    }
    return P;
  /*} catch (err) {
    console.log('[ ERROR ] Cannot load Plugin ' + name + ': ', err.message);
    throw 'Error loading plugin';
  }*/
};

cmd.prototype.execCommand = function(req, to, plugins, module, name, args) {// commands, yey
  if(module == "help") {
    var m = [];
    module = name || "";
    name = args[0] || "";
    if(!module) {
      for(var k in plugins) {
        m[m.length] = k;
      }
      this.bot.notice(req, "Modules: " + m.join(" "));
    } else if(!name) {
      if(!plugins[module]) {
        this.bot.notice(req, "Invalid module name");
        return false;
      }
      if(!plugins[module].help.commands) {
        this.bot.notice(req, "Module contains no commands");
        return false;
      }
      if(!plugins[module].help.commands) {
        this.bot.notice(req, "Module contains no commands");
        return false;
      }
      for(var k in plugins[module].help.commands) {
        m[m.length] = k;
      }
      this.bot.notice(req, module + ": " + plugins[module].help.description);
      this.bot.notice(req, "Commands in module " + module + ": " + m.join(" "));
    } else {
      var p = plugins[module].help.commands[name];
      if(!p) {
        this.bot.notice(req, "Invalid command name");
        return false;
      }
      p = plugins[module].help.commands[name];
      var arg = [];
      var ex = [];
      
      this.bot.notice(req, name + (p.admin || p.private ? " [" + ((p.admin?"ADMIN":"")+(p.admin && p.private?",":'')+(p.private?"PRIVATE":"")) + "]" : "") + ": " + p.description);
      
      if(p.args) {
        for(var k in p.args) {
          if(p.args[k][0]) {
            arg[arg.length] = "<" + p.args[k][1] + ">";
          } else {
            arg[arg.length] = "[" + p.args[k][1] + "]";
          }
        }
        this.bot.notice(req, "Usage: ."+module+" "+name+" " + arg.join(" "));
      }
      if(p.example) {
        for(var k in p.example) {
          ex[ex.length] = p.example[k];
        }
        this.bot.notice(req, "Example: ."+module+" "+name+" " + ex.join(" "));
      }
    }
    return false;
  }
  
  var p = plugins[module];
  if(this.glob[module] && this.cCmd(module, name, plugins)) {
    args.unshift(req, to, name);
    p = this.glob[module][1];
    
    p.apply(plugins[module], args);
    return false;
  }
  
  if(!p) {
    this.bot.notice(req, "Invalid module");
    return false;
  }
  p = p.commands;
  if(!p) {
    this.bot.notice(req, "No commands in this module");
    return false;
  }
  p = p.public;
  if(!p) {
    this.bot.notice(req, "No public commands in this module");
    return false;
  }
  p = p[name];
  if(!p) {
    this.bot.notice(req, "Invalid command name");
    return false;
  }
  args.unshift(req, to);

  p.apply(plugins[module], args);
};

cmd.prototype.execPMCommand = function(req, plugins, module, name, args) {
  var p = plugins[module];
  if(!p) {
    this.bot.notice(req, "Invalid module");
    return false;
  }
  
  if(!p) {
    this.bot.notice(req, "Invalid module");
    return false;
  }
  p = p.commands;
  if(!p) {
    this.bot.notice(req, "No commands in this module");
    return false;
  }
  p = p.private;
  if(!p) {
    this.bot.notice(req, "No private commands in this module");
    return false;
  }
  p = p[name];
  if(!p) {
    this.bot.notice(req, "Invalid command name");
    return false;
  }
  
  args.unshift(req);
  p.apply(plugins[module], args);
};

module.exports = cmd;

