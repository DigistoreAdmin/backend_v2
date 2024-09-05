const { businessLoanUnsecuredNew } = require("../../controller/Loan/businessLoanNewUnsecuredController")
const { verifyToken, verifyRefreshToken } = require("../../utils/token")

const router = require("express").Router()

router.route('/businessLoanNewUnsecured').post(verifyToken,verifyRefreshToken,businessLoanUnsecuredNew)

module.exports = router