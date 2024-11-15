const { fetchBill, billPayment } = require('../../controller/rechapi-controllers/billPaymentController')
const { verifyToken, verifyRefreshToken } = require("../../utils/token");

const router = require('express').Router()

router.route("/fetchBill").post(verifyToken,verifyRefreshToken,fetchBill)
router.route("/billPayment").post(verifyRefreshToken,verifyRefreshToken,billPayment)

module.exports =router