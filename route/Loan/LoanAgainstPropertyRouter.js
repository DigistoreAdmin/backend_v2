const express = require('express')
const { createLoanAgainstProperty } = require('../../controller/Loan/LoanAgainstPropertyController')
const { verifyToken, verifyRefreshToken } = require("../../utils/token");

const route = express.Router()

route.post('/createLoanAgainstProperty', verifyToken,verifyRefreshToken,createLoanAgainstProperty)

module.exports = route