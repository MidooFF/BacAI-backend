const express = require("express");
const router = express.Router();
const verifyResetCodeController = require("../controllers/verifyResetCodeController.js");

router.post("/", verifyResetCodeController.verifyResetCode);

module.exports = router;
