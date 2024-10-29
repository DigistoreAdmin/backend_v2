const express = require('express')
const { createPancard, updatePanDetails } = require('../controller/pancardController')
const { verifyToken, verifyRefreshToken } = require("../utils/token");

const route = express.Router()

route.post('/createPancard', verifyToken,verifyRefreshToken,createPancard)
route.put('/updatePanDetails', verifyToken,verifyRefreshToken,updatePanDetails)

module.exports = route