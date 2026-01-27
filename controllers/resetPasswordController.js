const User = require("../model/User.js");
const bcrypt = require("bcrypt");

const resetPassword = async (req, res) => {
  try {
    const { resetToken, newPassword } = req.body;

    const foundUser = await User.findOne({
      resetPasswordToken: resetToken,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!foundUser) {
      return res
        .status(400)
        .json({ message: "Invalid or expired reset token" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    foundUser.password = hashedPassword;
    foundUser.resetPasswordToken = undefined;
    foundUser.resetPasswordExpires = undefined;
    foundUser.verificationCode = undefined;
    foundUser.verificationCodeExpires = undefined;
    await foundUser.save();

    res.json({ message: "Password reset successful" });
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: "Server Error" });
  }
};

module.exports = { resetPassword };
