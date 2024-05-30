const dotenv = require("dotenv");

dotenv.config();

exports.getConfig = async (req, res) => {
  res.status(200).json({
    status: "OK",
    data: process.env.CLIENT_ID,
  });
};
