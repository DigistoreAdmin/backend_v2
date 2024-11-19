const express = require('express')
const router = express.Router()
const { verifyToken, verifyRefreshToken } = require("../utils/token.js");
const { staffWorkTime } = require('../controller/workMonitoringController.js');

router.route("/updateWorkTime").put(verifyToken, verifyRefreshToken, staffWorkTime)

module.exports = router