const router = require("express").Router();
const {
  createMicroLoanShops,
} = require("../../controller/Loan/microLoanShopsController");
const { verifyToken, verifyRefreshToken } = require("../../utils/token");

router
  .route("/microLoanShop")
  .post(verifyToken, verifyRefreshToken, createMicroLoanShops);

module.exports = router;
