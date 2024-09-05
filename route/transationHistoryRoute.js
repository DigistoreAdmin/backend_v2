const { restrictTo } = require("../controller/authController");
const {
  transationHistoryAdmin,
  transactionHistoryFranchise,
} = require("../controller/transationHistoryController");
const { verifyToken, verifyRefreshToken } = require("../utils/token");
const router = require("express").Router();

router
  .route("/transationHistoryAdmin")
  .get(
    verifyToken,
    verifyRefreshToken,
    restrictTo("admin"),
    transationHistoryAdmin
  );
router
  .route("/transactionHistoryFranchise")
  .get(verifyToken, verifyRefreshToken, transactionHistoryFranchise);

module.exports = router;
