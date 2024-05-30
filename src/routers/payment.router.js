"use strict";
const payment_controller = require("../controllers/payment.controller");
module.exports = (app) => {
  app.route("/payment/config").get(payment_controller.getConfig);
};
