const  businessLoanExisting  = require('../../controller/Loan/businessLoanExistingController')
const { verifyToken, verifyRefreshToken } = require('../../utils/token')
const router = require('express').Router()

router.route('/businessLoanExisting').post(verifyToken, verifyRefreshToken, businessLoanExisting)

module.exports = router