module.exports = {
  // List of IRC channels to join
  channels: ["#yolo"],
  // IRC server
  server: "irc.gamesurge.net",

  // Nickname of the bot
  botName: "narwhaals",

  // List of plugins to load
  plugins: ["match", "bot", "login", "youtube", "emotes", "ctcp", "insult", "chuck", "logger", "webadmin", "op"],

  // List of valid users that can login
  users: {
    // User format:
    //   IRC_Name: [priv_lvl, "password"]
    // Example:
    Narwhaal: [2, "myPass"]
  },
  
  plugin_config: {
    // Format:
    //  PluginName: {settingname: option}
    youtube: {
      api_key: 'your_api_key'
    }
  }
};
