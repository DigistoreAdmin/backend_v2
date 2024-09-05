const { companyFormation } = require('../controller/companyFormation');
const { verifyToken, verifyRefreshToken } = require('../utils/token');
const router = require('express').Router();

router.route('/companyFormation').post(verifyToken,verifyRefreshToken,companyFormation)

module.exports =router