const { restrictTo } = require("../controller/authController");
const {mobileRecharge,callBackUrl} = require("../controller/phoneRechargeController");
const {verifyToken, verifyRefreshToken} = require('../utils/token')
const router = require("express").Router();


router.route("/mobileRecharge").post(verifyToken,verifyRefreshToken,mobileRecharge); //

router.route("/callBackUrl").get(callBackUrl); //


module.exports = router; 