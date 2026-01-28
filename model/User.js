const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },

  refreshToken: String,
  lastSub: String,
  isVerifiedForReset: Boolean,
  verificationCode: String,
  verificationCodeExpires: Date,
});

module.exports = mongoose.model("User", userSchema);
