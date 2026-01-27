const nodemailer = require("nodemailer");
const User = require("../model/User.js");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendVerificationCode = async (email, code) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Password Reset Verifcation Code",
    html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">طلب تغيير كلمة السر</h2>
        <p>لتتمكن من تغيير كلمة السر الخاصة بحسابك, استعمل هذا الكود:</p>
        <div style="background-color: #f4f4f4; padding: 20px; text-align: center; margin: 20px 0;">
            <h1 style="color: #2c3e50; letter-spacing: 5px;">${code}</h1>
        </div>
        <p>ستنتهي صلاحية هذا الكود خلال 10 دقائق</p>
    </div>
`,
  };
  return await transporter.sendMail(mailOptions);
};

const generateVerificationCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const foundUser = await User.findOne({ email: email }).exec();
    if (!foundUser) {
      return res.status(401).json({ message: `User ${email} was not found` });
    }

    const verificationCode = generateVerificationCode();
    const verificationCodeExpires = Date.now() + 10 * 60 * 1000; // 10 minutes

    foundUser.verificationCode = verificationCode;
    foundUser.verificationCodeExpires = verificationCodeExpires;
    await foundUser.save();

    await sendVerificationCode(email, verificationCode);

    res.json({
      message: "Verification Code Sent to email",
      email: email,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server Error" });
  }
};

module.exports = { forgotPassword };
