const User = require("../model/User.js");
const bcrypt = require("bcrypt");
const passwordComplexity = require("joi-password-complexity");

const handleRegister = async (req, res) => {
  const usernameOptions = {
    min: 5,
    max: 26,
    lowerCase: 0,
    upperCase: 0,
    numeric: 1,
    symbol: 0,
    requirementCount: 0,
  };
  const passwordOptions = {
    min: 7,
    max: 26,
    lowerCase: 0,
    upperCase: 0,
    numeric: 1,
    symbol: 0,
    requirementCount: 0,
  };
  const { username, password, email } = req.body;
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!username || !password || !email) {
    return res
      .status(400)
      .json({ message: "username and password and email are required" });
  }
  const usernameValidate =
    passwordComplexity(usernameOptions).validate(username);
  const passwordValidate =
    passwordComplexity(passwordOptions).validate(password);
  const emailValidate = emailPattern.test(email);

  if (usernameValidate.error || passwordValidate.error || !emailValidate) {
    return res.status(400).json({
      message: "username or password or email wasn't given correctly",
    });
  }

  const duplicateUsername = await User.findOne({ username: username }).exec();
  const duplicateEmail = await User.findOne({ email: email });
  if (duplicateUsername || duplicateEmail) {
    return res.sendStatus(409);
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await User.create({
      username,
      password: hashedPassword,
      email,
    });
  } catch (err) {
    console.log(err);
    return res.sendStatus(500);
  }
  res.status(204).json({ message: `new user ${username} is created!` });
};

module.exports = { handleRegister };
