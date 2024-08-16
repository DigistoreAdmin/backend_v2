const gstFiling = require('../controller/gstFilingController')
const { verifyToken, verifyRefreshToken } = require('../utils/token')
const router = require('express').Router()

router.route('/gstFiling').post(verifyToken, verifyRefreshToken, gstFiling)

module.exports = router