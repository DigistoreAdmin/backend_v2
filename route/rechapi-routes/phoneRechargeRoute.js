const { phoneRecharge } = require('../../controller/rechapi-controllers/phoneRechargeController')
const { verifyToken, verifyRefreshToken } = require('../../utils/token')

const router = require('express').Router()

router.route("/phoneRecharge").post(verifyToken,verifyRefreshToken,phoneRecharge)

module.exports = router