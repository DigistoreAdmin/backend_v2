const { mostCommissionByFranchise } = require('../../controller/accountantController/franchiseCommision');
const { verifyToken, verifyRefreshToken } = require('../../utils/token');
const router = require('express').Router();

router.get('/mostCommissionByFranchise',verifyToken, verifyRefreshToken,mostCommissionByFranchise)

module.exports =router

