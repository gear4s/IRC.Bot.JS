module.exports = {
  // List of IRC channels to join
  channels: ["#graphox.us"],
  // IRC server
  server: "irc.gamesurge.net",

  // Nickname of the bot
  botName: "narwhaals",

  // List of plugins to load
  plugins: ["match", "bot", "login", "youtube", "emotes", "ctcp", "insult", "chuck", "logger"],

  // List of valid users that can login
  users: {
    // User format:
    //   IRC_Name: [priv_lvl, "password"]
    // Example:
    Narwhaal: [2, "myPass"]
  }
};
