const { reassign } = require('../controller/reAssignController');
const { verifyToken, verifyRefreshToken } = require('../utils/token');

const router = require('express').Router();

router.route('/reassign').put(verifyToken,verifyRefreshToken,reassign)

module.exports =router