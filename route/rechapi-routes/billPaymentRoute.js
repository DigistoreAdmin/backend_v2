const { fetchBill, billPayment } = require('../../controller/rechapi-controllers/billPaymentController')

const router = require('express').Router()

router.route("/fetchBill",fetchBill)
router.route("/billPayment",billPayment)

module.exports =router