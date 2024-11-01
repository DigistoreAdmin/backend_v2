const express = require('express')
const router = express.Router()
const { verifyToken, verifyRefreshToken } = require("../utils/token.js");
// const { restrictTo } = require('../controller/authController.js');
const { staffWorkTime, breakTime } = require('../controller/workMonitoringController.js');

router.route("/updateWorkTime").put(verifyToken, verifyRefreshToken, staffWorkTime)
router.route("/breakpoints").put(verifyToken, verifyRefreshToken, breakTime)

module.exports = router