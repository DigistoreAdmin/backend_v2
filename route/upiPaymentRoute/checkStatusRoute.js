const { checkStatus } = require("../../controller/upiPaymentController/checkStatusController")
const { verifyToken, verifyRefreshToken } = require("../../utils/token");

const router =require("express").Router()

router.route("/checkStatus").post(verifyToken,verifyRefreshToken,checkStatus)

module.exports = router