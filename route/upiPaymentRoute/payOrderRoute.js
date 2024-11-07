const { payOrder } = require("../../controller/upiPaymentController/payOrderController");
const { verifyToken, verifyRefreshToken } = require("../../utils/token");

const router = require("express").Router();

router.route("/payOrder").post(verifyToken, verifyRefreshToken, payOrder);

module.exports = router;
