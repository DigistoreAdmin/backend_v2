const {
  login,
  logout,
  changePassword,
} = require("../controller/authController");
const { authentication, restrictTo,senndOtp, checkOTP  } = require("../controller/authController");
const { verifyToken, verifyRefreshToken } = require("../utils/token");

const router = require("express").Router();



router.route("/verify-mobile").post(verifyToken,verifyRefreshToken, restrictTo("admin"),senndOtp);
router.route("/verify-otp").post(verifyToken,verifyRefreshToken, restrictTo("admin"),checkOTP); 

router.route("/login").post(login);
router.route("/logout").post(logout);
router.route('/changePassword').post(verifyToken,verifyRefreshToken,changePassword)





module.exports = router;
  