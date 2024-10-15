const router = require("express").Router();
const { createStaffs } = require("../controller/staffController");

const { verifyOTP, restrictTo } = require("../controller/authController");
const { verifyToken, verifyRefreshToken } = require("../utils/token");

router
  .route("/createStaff")
  .post(verifyToken, verifyRefreshToken, restrictTo("admin"), createStaffs);

module.exports = router;
