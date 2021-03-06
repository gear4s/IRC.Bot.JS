"use strict"; // yup

// Check if not running Windows
var plat = process.getuid || (require("os")).platform
if(plat() !== "win32") {
  // check root
  if(process.getuid() === 0) {
    console.log('[ WARNING ] Running this bot in root is EVIL!');
  }
}

// Get the libs
var irc = require("irc");
var config = require("./config");
var users = new (require("./auth"))(config.users);
var plugins = {};

// Create the bot name
var bot = new irc.Client(config.server, config.botName, {
  channels: config.channels,
  userName: 'narwhaals',
  realName: 'narwhaal\'s IRC client',
  port: 6667,
  debug: false,
  showErrors: true,
  stripColors: true,
});
bot.isop = {};
bot.isvoice = {};

// populate isop/isvoice
bot.addListener("join", function (chan, who) {
  // Welcome them in!
  if(who == bot.opt.nick) {
    bot.isop[chan] = false;
    bot.isvoice[chan] = false;
  }
});

bot.addListener("+mode", function (chan, by, mode, arg) {
  if((mode == "o" || mode == "v") && arg == bot.nick) {
    console.log("[ INFO ] Just been " + (mode == "o" ? "opped" : "voiced") + " in " + chan);

    bot["is" + (mode == "o" ? "op" : "voice")][chan] = true;
  }
});

bot.addListener("-mode", function (chan, by, mode, arg) {
  if((mode == "o" || mode == "v") && arg == bot.nick) {
    console.log("[ INFO ] Just been de" + (mode == "o" ? "opped" : "voiced") + " in " + chan);

    bot["is" + (mode == "o" ? "op" : "voice")][chan] = false;
  }
});

var command = new (require('./command'))(bot);
var P;
for(var i in config.plugins) {
  var mconf = {};
  if(config.plugin_config[config.plugins[i]]) {console.log(config.plugins[i]); mconf = config.plugin_config[config.plugins[i]];}
  P = command.loadModule(config.plugins[i], bot, users, config.users, mconf);
  if(P != false) {
    plugins[config.plugins[i]] = P
  }
}

bot.addListener("registered", function (message) {
  console.log("[ INFO ] Connected to server");
});

bot.addListener("ctcp", function (from, to, text) {
  console.log("[ INFO ] Recieved a CTCP " + text + " from " + from);
});

bot.addListener("nick", function (oldnick, newnick) {
  users.update(oldnick, newnick);
  plugins.match.update(oldnick, newnick);
});

bot.addListener("message#", function(from, to, texto) {
	if(from == config.botName) return false;
	
  var text = texto.substr(1).split(" ");
  if(texto[0] != ".") return false;
  
  var mod = text[0];
  var cmd = text[1];
  text.shift();
  text.shift();
  
  command.execCommand(from, to, plugins, mod, cmd, text);
});

bot.addListener("pm", function(from, texto) {
	if(from == config.botName) return false;
  var text = texto.split(" ");
  
  var mod = text[0];
  var cmd = text[1];
  text.shift();
  text.shift();
  command.execPMCommand(from, plugins, mod, cmd, text);
});

var c = function() {
  console.log("[ NOTE ] Gracefully shutting down from SIGINT (Ctrl-C)");
  bot.disconnect("Adios fuckers");
  process.exit( );
};

process.on('SIGHUP', c);
process.on('SIGINT', c);
process.on('SIGQUIT', c);
process.on('SIGABRT', c);
process.on('SIGTERM', c);

