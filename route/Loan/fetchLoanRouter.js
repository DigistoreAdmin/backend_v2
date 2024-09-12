const { getPersonalLoanDetails, getBusinessLoanUnsecuredNewDetails } = require('../../controller/Loan/fetchLoansController')
const { verifyToken, verifyRefreshToken } = require('../../utils/token')

const router = require('express').Router()

router.route('/getPersonalLoanDetails').get(verifyToken,verifyRefreshToken,getPersonalLoanDetails)
router.route('/getBusinessLoanUnsecuredNewDetails').get(verifyToken,verifyRefreshToken,getBusinessLoanUnsecuredNewDetails)

module.exports = router