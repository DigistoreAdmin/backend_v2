const { mostCommisionedFranchise } = require('../../controller/accountantController/franchiseCommision')
const { verifyToken, verifyRefreshToken } = require('../../utils/token')

const router = require('express').Router()

router.route("/mostCommisionedFranchise").get(mostCommisionedFranchise)

module.exports = router