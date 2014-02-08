var express = require('express'),
    http = require('http'),
    app = express(),
    httpServer = http.createServer(app);

function webmin(bot) {
  this.help = {
    description: "Webadmin interface for narwhaals"
  };

  this.bot = bot;

  app.get('/part', function(req, res){
    if(req.query.chan) {
      bot.part("#" + req.query.chan);
      res.send("Parted #" + req.query.chan + ". <a href=\"/\">Go Back</a>");
    }
  });

  app.get('/join', function(req, res){
    if(req.query.chan) {
      bot.join("#" + req.query.chan.replace(/\#/g, ''));
      res.send("Joined #" + req.query.chan.replace(/\#/g, '') + ". <a href=\"/\">Go Back</a>");
    }
  });

  app.use(express.static(__dirname + '/webpage/static'));

  app.set('views', __dirname + "/webpage/public");
  app.set('view engine', 'jade');

  app.get('/', function(req, res){
    res.render('index', { channels: bot.chans });
  });

  app.listen(3000);
  console.log("Webadmin online @ Port 3000");
}

module.exports = webmin;
