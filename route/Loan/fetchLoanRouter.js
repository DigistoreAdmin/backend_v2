const { getPersonalLoanDetails, getBusinessLoanUnsecuredNewDetails } = require('../../controller/Loan/fetchLoansController')

const router = require('express').Router()

router.route('/getPersonalLoanDetails').get(getPersonalLoanDetails)
router.route('/getBusinessLoanUnsecuredNewDetails').get(getBusinessLoanUnsecuredNewDetails)

module.exports = router