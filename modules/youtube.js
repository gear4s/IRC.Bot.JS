"use strict";

var youtube = function(bot, _, __, modconf) {
  this.help = {
    description: "Get youtube video info"
  }
  
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
        youtube.getById(parseVideoURL(t[u]), function(data) {
          data = data.items[0];
          bot.say(to, "[" + data.snippet.channelTitle + "] " + data.snippet.title + " - " + data.statistics.likeCount + " likes, " + data.statistics.dislikeCount + " dislikes");
        });
      }
    }
  });
};

module.exports = youtube;
