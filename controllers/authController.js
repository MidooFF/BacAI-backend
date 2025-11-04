const User = require("../model/User.js");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const handleLogin = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "username and password are required" });
  }
  try {
    const foundUser = await User.findOne({ username: username }).exec();
    if (!foundUser) {
      return res
        .status(401)
        .json({ message: `user ${username} was not found` });
    }
    const match = await bcrypt.compare(password, foundUser.password);
    if (match) {
      const accessToken = jwt.sign(
        {
          username,
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "10m" }
      );
      const refreshToken = jwt.sign(
        { username },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: "10d" }
      );
      foundUser.refreshToken = refreshToken;
      const result = await foundUser.save();
      res.cookie("jwt", refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 1000 * 60 * 60 * 24,
      });
      res.json({ accessToken });
    } else {
      return res.status(403).json({ message: "password is not correct" });
    }
  } catch (err) {
    console.log(err);
    return res.sendStatus(500);
  }
};

module.exports = { handleLogin };
