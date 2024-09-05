const { sendOtp, verifyOtp, resetPassword } = require('../controller/forgotPasswordController')
const router = require("express").Router();

router.route('/sendOtp').post(sendOtp)
router.route('/verifyOtp').post(verifyOtp)
router.route('/resetPassword').post(resetPassword)

module.exports = router