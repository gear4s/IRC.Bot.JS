"use strict";

var youtube = function(bot) {
  this.help = {
    description: "Get youtube video info"
  }

  function parseVideoURL(url) {
    var p = /^(?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((.|-){11})(?:\S+)?$/;
    return (url.match(p)) ? RegExp.$1 : false;
  }
  
  bot.addListener("message#", function(from, to, texto) {
    var t = texto.split(" ");
    var youtube = require('youtube-node');
    for(var u in t) {
      if(parseVideoURL(t[u])) {
        youtube.getById(parseVideoURL(t[u]), function(data) {
          bot.say(to, "[" + data.author.name+ "] " + data.title + " - " + data.rating.numLikes + " likes, " + data.rating.numDislikes + " dislikes");
        });
      }
    }
  });
};

module.exports = youtube;
