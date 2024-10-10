const businessLoanExisting = require('../../controller/Loan/businessLoanExistingController')
const { verifyToken, verifyRefreshToken } = require('../../utils/token')
const router = require('express').Router()

const { updateLoan } = require("../../controller/Loan/staffUpdateController")

router.route('/updateLoan').post(verifyToken, verifyRefreshToken, updateLoan)

module.exports = router