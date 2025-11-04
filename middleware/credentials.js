const whitelist = require("../config/whiteList.js");

const credentials = (req, res, next) => {
  const origin = req.headers.origin;
  if (whitelist.includes(origin)) {
    // Use includes() instead
    res.header("Access-Control-Allow-Credentials", true);
  }
  next();
};
module.exports = credentials;
