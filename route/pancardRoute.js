const express = require('express')
const { createPancard,staffPanCardReject,staffPanCardComplete,staffPanCardVerify} = require('../controller/pancardController')
const { verifyToken, verifyRefreshToken } = require("../utils/token");

const route = express.Router()

route.post('/createPancard', verifyToken,verifyRefreshToken,createPancard)
route.put('/staffPanCardReject', verifyToken,verifyRefreshToken,staffPanCardReject)
route.put('/staffPanCardComplete', verifyToken,verifyRefreshToken,staffPanCardComplete)
route.put('/staffPanCardVerify', verifyToken,verifyRefreshToken,staffPanCardVerify)

module.exports = route