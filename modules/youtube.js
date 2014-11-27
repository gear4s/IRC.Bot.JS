"use strict";

var youtube = function(bot, _, __, modconf) {
  this.help = {
    description: "Get youtube video info"
  }
  
  var us = {};
  
  modconf = modconf;

  function parseVideoURL(url) {
    var p = /^(?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((.|-){11})(?:\S+)?$/;
    return (url.match(p)) ? RegExp.$1 : false;
  }
  
  bot.addListener("message#", function(from, to, texto) {
    var t = texto.split(" ");
    var youtube = require('youtube-node');
    
    youtube.setKey(modconf.api_key);
    
    for(var u in t) {
      if(parseVideoURL(t[u])) {
        if(us[from]) {
          var d = new Date();
          if(us[from].amt == 3) {
            us[from].time.setMinutes(d.getMinutes() + 5);
            bot.notice(from, "Your permission to use YouTube is now disabled for 5 minutes");
            
            us[from].amt = 0;
            
            return false;
          } else {
            if(us[from].time > d) {
              var td = us[from].time - d;
              td -= Math.floor(td / 1000 / 60 / 60) * 1000 * 60 * 60;
              var mm = Math.floor(td / 1000 / 60);
              td -= mm * 1000 * 60;
              var ss = Math.floor(td / 1000);
              
              bot.notice(from, "Your permission to use YouTube has been disabled; enabling in " + mm + "min " + ss + "s");
              return false;
            } else {
              us[from].amt += 1;
            }
          }
        } else {
          us[from] = {amt: 1, time: new Date()};
        }
        
        youtube.getById(parseVideoURL(t[u]), function(data) {
          if(data.pageInfo.totalResults == 0) {
            bot.notice(from, "Invalid YouTube ID: " + parseVideoURL(t[u]));
            return;
          }
          data = data.items[0];
          bot.say(to, "[" + data.snippet.channelTitle + "] " + data.snippet.title + " - " + data.statistics.likeCount + " likes, " + data.statistics.dislikeCount + " dislikes");
        });
      }
    }
  });
};

module.exports = youtube;
