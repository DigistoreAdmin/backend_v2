const express = require('express')
const { createPancard } = require('../controller/pancardController')
const { verifyToken, verifyRefreshToken } = require("../utils/token");

const route = express.Router()

route.post('/createPancard', verifyToken,verifyRefreshToken,createPancard)

module.exports = route