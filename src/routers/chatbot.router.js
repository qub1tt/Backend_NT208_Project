"use strict";
const chat = require("../controllers/chatbot.controller");
module.exports = (app) => {
  app.route("/chat").post(chat.chatBot);
};
