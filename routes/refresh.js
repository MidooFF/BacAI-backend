const express = require("express");
const router = express.Router();
const refreshController = require("../controllers/refreshController.js");

router.get("/", refreshController.handleRefresh);

module.exports = router;
