const { fssaiLicence } = require('../controller/fssaiLicenceController')
const router = require('express').Router()
const { verifyToken, verifyRefreshToken } = require('../utils/token')

router.route('/fssaiLicence').post(verifyToken, verifyRefreshToken, fssaiLicence)

module.exports = router