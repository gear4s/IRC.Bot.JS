"use strict";

var emotes = function(bot) {
  this.help = {
    description: "Emoticons for text"
  }

  bot.addListener("message#", function(from, to, texto) {
    for(var i in texto.split(" ")) {
      switch(texto.split(" ")[i]) {
        case "mad": bot.say(to, "(\u256F\u00B0\u25A1\u00B0\uFF09\u256F\uFE35 \u253B\u2501\u253B"); break;
        case "soviet": if(texto.split(" ")[parseInt(i) + 1].replace(/,/g, '').replace(/\:/g, '') == "russia") bot.say(to, "\u252C\u2500\u252C\uFEFF \uFE35 /(.\u25A1. \\\uFF09"); break;
        case "calm": if(texto.split(" ")[parseInt(i) + 1].replace(/,/g, '').replace(/\:/g, '') == "down") bot.say(to, "\u252C\u2500\u2500\u252C \u30CE( \u309C-\u309C\u30CE)"); break;
      }
    }
  });
};

module.exports = emotes;
