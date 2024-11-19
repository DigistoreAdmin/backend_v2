const { mostCommisionedFranchise } = require('../../controller/accountantController/franchiseCommision')
const { verifyToken, verifyRefreshToken } = require('../../utils/token')

const router = require('express').Router()

router.route("/mostCommisionedFranchise").get(verifyToken,verifyRefreshToken,mostCommisionedFranchise)

module.exports = router