const {checkIntentStatus} = require('../../controller/upiPaymentController/checkIntentStatusController');
const { verifyToken, verifyRefreshToken } = require('../../utils/token');
const router = require('express').Router();

router.route('/checkIntentStatus').post(verifyToken, verifyRefreshToken, checkIntentStatus)

module.exports =router