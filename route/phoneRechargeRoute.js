const { restrictTo } = require("../controller/authController");
const {mobileRecharge,} = require("../controller/phoneRechargeController");
const {verifyToken, verifyRefreshToken} = require('../utils/token')
const router = require("express").Router();


router.route("/mobileRecharge").post(verifyToken,verifyRefreshToken,mobileRecharge); //


module.exports = router; 