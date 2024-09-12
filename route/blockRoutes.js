const { restrictTo } = require("../controller/authController");
const {
  updateFranchiseBlock,
} = require("../controller/franchiseBlockController");
const { staffAccess } = require("../controller/staffAccessController");

const { verifyToken, verifyRefreshToken } = require("../utils/token");
const router = require("express").Router();

router
  .route("/updateFranchiseBlock")
  .put(
    verifyToken,
    verifyRefreshToken,
    restrictTo("admin"),
    updateFranchiseBlock
  );
router
  .route("/updateStaffAccess")
  .put(verifyToken, verifyRefreshToken, restrictTo("admin"), staffAccess);

module.exports = router;
