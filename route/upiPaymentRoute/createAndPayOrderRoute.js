const {
  createAndPayOrder,
} = require("../../controller/upiPaymentController/upiCreateAndPayOrderController");
const { verifyToken, verifyRefreshToken } = require("../../utils/token");

const router = require("express").Router();

router
  .route("/createAndPayOrder")
  .post(verifyToken, verifyRefreshToken, createAndPayOrder);

module.exports = router;
