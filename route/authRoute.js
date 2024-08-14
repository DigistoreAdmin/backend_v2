const { login, logout } = require("../controller/authController");
const {
  transationHistory,
  authentication,
  restrictTo,
  senndOtp,
  checkOTP,
} = require("../controller/authController");
const { verifyToken, verifyRefreshToken } = require("../utils/token");

const router = require("express").Router();

router
  .route("/verify-mobile")
  .post(verifyToken, verifyRefreshToken, restrictTo("admin"), senndOtp);
router
  .route("/verify-otp")
  .post(verifyToken, verifyRefreshToken, restrictTo("admin"), checkOTP);
router
  .route("/transationHistory")
  .get(verifyToken, verifyRefreshToken, restrictTo("admin"), transationHistory);

router.route("/login").post(login);
router.route("/logout").post(logout);

module.exports = router;
