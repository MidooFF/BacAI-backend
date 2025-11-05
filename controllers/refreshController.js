const User = require("../model/User.js");
const jwt = require("jsonwebtoken");

const handleRefresh = async (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) {
    return res.sendStatus(401);
  }

  const refreshToken = cookies.jwt;

  const foundUser = await User.findOne({ refreshToken: refreshToken }).exec();
  if (!foundUser) {
    console.log("user not found");
    return res.sendStatus(403);
  }

  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
    if (err || decoded.username !== foundUser.username) {
      console.log(err);
      return res.sendStatus(403);
    }
  });
  const accessToken = jwt.sign(
    {
      username: foundUser.username,
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "10m" }
  );
  res.json({ accessToken });
};

module.exports = { handleRefresh };
