const { checkStatus } = require("../../controller/upiPaymentController/checkStatusController")

const router =require("express").Router()

router.route("/checkStatus").post(checkStatus)

module.exports = router