const { restrictTo } = require("../controller/authController");
const {
  sendOtpPhoneNumber,
  verifyOtp,
  sendOtpEmail,
  creatFranchise,
  wallet,
  updateFranchise,
} = require("../controller/franchiseController");
const {verifyToken, verifyRefreshToken} = require('../utils/token')
const router = require("express").Router();



router.route("/sendOtpPhoneNumber").post(sendOtpPhoneNumber);
router.route("/sendOtpEmail").post(sendOtpEmail);

router.route("/verifyOtp").post(verifyOtp);

router.route("/creatFranchise").post(creatFranchise);

router.route("/wallet").get(verifyToken,verifyRefreshToken,wallet);

router.route("/updateFranchise").put(verifyToken,verifyRefreshToken, restrictTo("franchise"), updateFranchise)


module.exports = router; 
 