const express = require('express')
const router = express.Router()
const { deleteFranchise, updateStaffDetails, updateFranchiseDetails, updateWallet } = require("../controller/adminEditController.js")
const { verifyToken, verifyRefreshToken } = require("../utils/token");
const { restrictTo } = require('../controller/authController.js');

router.route("/deleteFranchise").delete(verifyToken, verifyRefreshToken, restrictTo("admin"), deleteFranchise)
router.route('/updateStaffDetails').put(verifyToken, verifyRefreshToken, updateStaffDetails)
router.route('/updateFranchiseDetails').put(verifyToken,verifyRefreshToken,updateFranchiseDetails)
router.route('/updateWallet').put(verifyToken,verifyRefreshToken,updateWallet)

module.exports = router