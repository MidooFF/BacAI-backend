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
  const { username, password } = req.body;
  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "username and password are required" });
  }
  const usernameValidate =
    passwordComplexity(usernameOptions).validate(username);
  const passwordValidate =
    passwordComplexity(passwordOptions).validate(password);

  if (usernameValidate.error || passwordValidate.error) {
    return res
      .status(400)
      .json({ message: "username or password wasn't given correctly" });
  }

  const duplicate = await User.findOne({ username: username }).exec();
  if (duplicate) {
    return res.sendStatus(409);
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await User.create({
      username,
      password: hashedPassword,
    });
  } catch (err) {
    console.log(err);
    return res.sendStatus(500);
  }
  res.status(204).json({ message: `new user ${username} is created!` });
};

module.exports = { handleRegister };
