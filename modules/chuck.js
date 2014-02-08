var jsyml = require('js-yaml');
var fs = require("fs");

require.extensions['.yml'] = function (module, filename) {
    module.exports = fs.readFileSync(filename, 'utf8');
};

function Chucky(bot) {
  this.help = {
    description: "Chuck Norris made this module",
    commands: {
      chuck: {
        admin: false,
        private: false,
        description: "Sends a Chuck Norris joke to the channel you're in"
      }
    }
  };
  this.bot = bot;
  
  this.facts;
  
  this.facts = require('./chuck.yml');
    
  console.log("+ [chucknorris] Loading chuck.yml ..");

  this.facts = jsyml.load(this.facts);
  console.log("+ [chucknorris] #{@@facts.length} Chuck Norris facts loaded...");
}

Chucky.prototype.global = {};
Chucky.prototype.global.chuck = function(req, to) {
  this.bot.say(to, this.facts[Math.floor(Math.random()*this.facts.length)]);
};

module.exports = Chucky;

