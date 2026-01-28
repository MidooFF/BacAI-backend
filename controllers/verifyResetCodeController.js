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

    foundUser.isVerifiedForReset = true;
    foundUser.verificationCode = undefined;
    foundUser.verificationCodeExpires = undefined;
    await foundUser.save();

    res.json({
      message: "Code verified successfully",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server Error" });
  }
};

module.exports = { verifyResetCode };
