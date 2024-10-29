const router = require("express").Router();
const { createStaffs, updateStaff } = require("../controller/staffController");

const { verifyOTP, restrictTo } = require("../controller/authController");
const { verifyToken, verifyRefreshToken } = require("../utils/token");
const { UPDLOCK } = require("sequelize/lib/table-hints");

router
  .route("/createStaff")
  .post(verifyToken, verifyRefreshToken, restrictTo("admin"), createStaffs);

  router.route("/updateStaff").put(verifyToken,verifyRefreshToken,updateStaff)

module.exports = router;
