const express = require("express");
const router = express.Router();
const resetPasswordController = require("../controllers/resetPasswordController.js");

router.post("/", resetPasswordController.resetPassword);

module.exports = router;
