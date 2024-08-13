const { restrictTo } = require("../controller/authController");
const {fetchBill,billPaymentRequest} = require("../controller/billPaymentController");
const {verifyToken, verifyRefreshToken} = require('../utils/token')
const router = require("express").Router();




router.route("/fetchBill").post(verifyToken,verifyRefreshToken,fetchBill);

router.route("/billPaymentRequest").post(verifyToken,verifyRefreshToken,billPaymentRequest); 


module.exports = router; 