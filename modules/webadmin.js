var express = require('express'),
    http = require('http'),
    app = express(),
    httpServer = http.createServer(app);

app.use(express.urlencoded()); app.use(express.json()); // POST variables
app.use(express.cookieParser());
app.use(express.session({secret: '1234567890QWERTY'}));

function webmin(bot, _, users) {
  this.help = {
    description: "Webadmin interface for narwhaals"
  };

  app.get('/part', function(req, res){
    if(!req.session.loggedin) {
      res.redirect('http://'+req.get('host') +'/login');
      return 0;
    }
    if(req.query.chan) {
      bot.part("#" + req.query.chan);
      res.send("Parted #" + req.query.chan + ". <a href=\"/\">Go Back</a>");
    }
  });

  app.get('/join', function(req, res){
    if(!req.session.loggedin) {
      res.redirect('http://'+req.get('host') +'/login');
      return 0;
    }
    if(req.query.chan) {
      bot.join("#" + req.query.chan.replace(/\#/g, ''));
      res.send("Joined #" + req.query.chan.replace(/\#/g, '') + ". <a href=\"/\">Go Back</a>");
    }
  });

  app.get('/nick', function(req, res){
    if(!req.session.loggedin) {
      res.redirect('http://'+req.get('host') +'/login');
      return 0;
    }
    if(req.query.new) {
      bot.send("NICK", req.query.new);
      res.send("Changed nickname to " + req.query.new + ". <a href=\"/\">Go Back</a>");
    }
  });

  app.post('/login', function(req, res) {
    if(req.session.loggedin) {
      res.send("You are already logged in. <a href=\"/\">Go Back</a>");
      return 0;
    }
    if(req.body.user && req.body.pass) {
      if(!users[req.body.user]) {res.render('login', {errortype: 1, error: "Invalid user."}); return 0;}
      if(users[req.body.user][1] != req.body.pass) {res.render('login', {errortype: 2, error: "Invalid password."}); return 0;}
      req.session.loggedin = true;
      res.redirect('http://'+req.get('host') +'/');
    } else {
      res.render('login');
    }
  });

  app.get('/login', function(req, res) {
    if(req.session.loggedin) {
      res.send("You are already logged in. <a href=\"/\">Go Back</a>");
      return 0;
    }
    if(req.body.user && req.body.pass) {
      if(!users[req.body.user]) {res.render('login', {errortype: 1, error: "Invalid user."}); return 0;}
      if(users[req.body.user][1] != req.body.pass) {res.render('login', {errortype: 2, error: "Invalid password."}); return 0;}
      req.session.loggedin = true;
      res.redirect('http://'+req.get('host') +'/');
    } else {
      res.render('login');
    }
  });

  app.use(express.static(__dirname + '/webpage/static'));

  app.set('views', __dirname + "/webpage/public");
  app.set('view engine', 'jade');

  app.get('/', function(req, res){
    if(!req.session.loggedin) {
      res.redirect('http://'+req.get('host') +'/login');
      return 0;
    }
    res.render('index', { channels: bot.chans });
  });

  var port = process.env["app_port"] || "3000";

  app.listen(port);
  console.log("Webadmin online @ Port " + port);
}

module.exports = webmin;
