const { fetchBill, billPayment } = require('../../controller/rechapi-controllers/billPaymentController')

const router = require('express').Router()

router.route("/fetchBill").post(fetchBill)
router.route("/billPayment").post(billPayment)

module.exports =router