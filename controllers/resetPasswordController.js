const User = require("../model/User.js");
const bcrypt = require("bcrypt");

const resetPassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    const foundUser = await User.findOne({
      email: email,
      isVerifiedForReset: true,
    });

    if (!foundUser) {
      return res
        .status(400)
        .json({ message: "Invalid or expired reset token" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    foundUser.password = hashedPassword;
    foundUser.isVerifiedForReset = false;
    // foundUser.resetPasswordExpires = undefined;
    // foundUser.verificationCode = undefined;
    // foundUser.verificationCodeExpires = undefined;
    await foundUser.save();

    res.json({ message: "Password reset successful" });
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: "Server Error" });
  }
};

module.exports = { resetPassword };
