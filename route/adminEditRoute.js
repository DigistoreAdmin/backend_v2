const express = require('express')
const router = express.Router()
const { deleteFranchise, updateStaffDetails } = require("../controller/adminEditController.js")
const { verifyToken, verifyRefreshToken } = require("../utils/token");
const { restrictTo } = require('../controller/authController.js');

router.route("/deleteFranchise").delete(verifyToken, verifyRefreshToken, restrictTo("admin"), deleteFranchise)
router.route('/updateStaffDetails').put(verifyToken, verifyRefreshToken, updateStaffDetails)

module.exports = router