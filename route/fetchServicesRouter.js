const express = require('express')
const { verifyToken, verifyRefreshToken } = require('../utils/token')
const { getPancardDetails } = require('../controller/fetchServicesController')

const route = express.Router()

route.get('/getPancardDetails', verifyToken,verifyRefreshToken,getPancardDetails)

module.exports = route