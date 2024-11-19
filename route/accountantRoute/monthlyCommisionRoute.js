const { getMonthlyCommissions } = require('../../controller/accountantController/monthlyCommision')
const { verifyToken, verifyRefreshToken } = require('../../utils/token')
const router = require('express').Router()

router.route('/getMonthlyCommissions').get(verifyToken, verifyRefreshToken, getMonthlyCommissions)

module.exports = router