const { createContact } = require('../controller/contactController');
const { verifyToken, verifyRefreshToken } = require('../utils/token');
const router = require('express').Router();

router.route('/createContact').post(createContact)

module.exports =router