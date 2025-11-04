const whiteList = require("./whiteList.js");

const corsOptions = {
  origin: (origin, callback) => {
    if (whiteList.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error("blocked by CORS"));
    }
  },
  credentials: true,
};

module.exports = corsOptions;
