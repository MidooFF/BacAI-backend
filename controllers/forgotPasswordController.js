// const nodemailer = require("nodemailer");
const User = require("../model/User.js");

// const transporter = nodemailer.createTransport({
//   service: "gmail",
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASS,
//   },
// });

// const sendVerificationCode = async (email, code) => {
//   const mailOptions = {
//     from: process.env.EMAIL_USER,
//     to: email,
//     subject: "Password Reset Verifcation Code",
//     html: `
//     <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
//         <h2 style="color: #333;">طلب تغيير كلمة السر</h2>
//         <p>لتتمكن من تغيير كلمة السر الخاصة بحسابك, استعمل هذا الكود:</p>
//         <div style="background-color: #f4f4f4; padding: 20px; text-align: center; margin: 20px 0;">
//             <h1 style="color: #2c3e50; letter-spacing: 5px;">${code}</h1>
//         </div>
//         <p>ستنتهي صلاحية هذا الكود خلال 10 دقائق</p>
//     </div>
// `,
//   };
//   return await transporter.sendMail(mailOptions);
// };

const sendVerificationCode = async (userEmail, verificationCode) => {
  const api_key = process.env.MAILEROO_API_KEY; // Your Sending Key from Step 1
  const senderEmail = process.env.SENDER_EMAIL; // Your verified sender address

  // Build the form data as required by Maileroo[citation:1]
  const formData = new FormData();
  formData.append("from", `BacAI <${senderEmail}>`); // Use your verified sender
  formData.append("to", userEmail);
  formData.append("subject", "Password Reset Verification Code");
  formData.append(
    "html",
    `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Password Reset Request</h2>
          <p>Use the verification code below to reset your password:</p>
          <div style="background-color: #f4f4f4; padding: 20px; text-align: center; margin: 20px 0;">
              <h1 style="color: #2c3e50; letter-spacing: 5px;">${verificationCode}</h1>
          </div>
          <p>This code will expire in 10 minutes.</p>
      </div>
  `
  );

  try {
    const response = await fetch("https://smtp.maileroo.com/send", {
      method: "POST",
      headers: {
        "X-API-Key": api_key, // Authenticate using the API key[citation:1]
      },
      body: formData,
    });

    const result = await response.json();

    if (response.ok && result.success) {
      console.log("Maileroo API: Email sent successfully");
      return { messageId: result.message }; // Adjust based on actual API response
    } else {
      console.error("Maileroo API Error:", result.message);
      throw new Error(result.message || "Failed to send email via API");
    }
  } catch (error) {
    console.error("Network/Maileroo Error:", error);
    throw error; // Re-throw to be caught by your main route handler
  }
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
