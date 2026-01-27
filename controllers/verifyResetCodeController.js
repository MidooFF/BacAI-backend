const User = require("../model/User.js");

const verifyResetCode = async (req, res) => {
  try {
    const { email, code } = req.body;
    const foundUser = await User.findOne({
      email: email,
      verificationCode: code,
      verificationCodeExpires: { $gt: Date.now() },
    }).exec();

    if (!foundUser) {
      return res
        .status(400)
        .json({ message: "Invalid or expired verification code" });
    }

    const resetToken =
      Math.random().toString(36).substring(2) + Date.now().toString(36);

    foundUser.resetPasswordToken = resetToken;
    foundUser.resetPasswordExpires = Date.now() + 15 * 60 * 1000;
    await foundUser.save();

    res.json({
      message: "Code verified successfully",
      resetToken,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server Error" });
  }
};

module.exports = { verifyResetCode };
