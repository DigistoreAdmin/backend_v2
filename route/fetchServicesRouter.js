const express = require('express')
const { verifyToken, verifyRefreshToken } = require('../utils/token')
const { getPancardDetails,fetchPassport,fetchKswift,fetchStaffs, } = require('../controller/fetchServicesController')

const route = express.Router()

route.get('/getPancardDetails', verifyToken,verifyRefreshToken,getPancardDetails)

router
  .route("/fetchPassport")
  .get(verifyToken, verifyRefreshToken, fetchPassport);

router.route("/fetchKswift").get(verifyToken, verifyRefreshToken, fetchKswift);
router.route("/fetchStaffs").get(verifyToken, verifyRefreshToken, fetchStaffs);

module.exports = router;
