const express = require("express");
const { verifyToken, verifyRefreshToken } = require("../../utils/token");
const {
  CreateOrder,
} = require("../../controller/upiPaymentController/createOrderController");

const router = express.Router();

router.route("/createOrder").post(verifyToken, verifyRefreshToken, CreateOrder);

module.exports = router;
