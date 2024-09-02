const {personalLoan } =require('../../controller/Loan/personalLoanController')

const { verifyToken, verifyRefreshToken } = require("../../utils/token"); 
const router = require('express').Router();

router.route('/personalLoan').post(verifyToken,verifyRefreshToken,personalLoan)

module.exports = router