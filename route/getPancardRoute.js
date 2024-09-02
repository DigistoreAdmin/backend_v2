const express = require('express')
const { verifyToken, verifyRefreshToken } = require('../utils/token')
const { getPancardDetails } = require('../controller/getPancardController')

const route = express.Router()

route.get('/getPancardDetails', verifyToken,verifyRefreshToken,getPancardDetails)

module.exports = route