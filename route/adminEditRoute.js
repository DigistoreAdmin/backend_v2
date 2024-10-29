const express = require('express')
const router = express.Router()
const { deleteFranchise, updateStaffDetails, updateFranchiseDetails, updateWallet,verifyFranchise } = require("../controller/adminEditController.js")
const { verifyToken, verifyRefreshToken } = require("../utils/token");
const { restrictTo } = require('../controller/authController.js');

router.route("/deleteFranchise").delete(verifyToken, verifyRefreshToken, restrictTo("admin"), deleteFranchise)
router.route('/updateStaffDetails').put(verifyToken, verifyRefreshToken, restrictTo("admin"), updateStaffDetails)
router.route('/updateFranchiseDetails').put(verifyToken,verifyRefreshToken, restrictTo("admin","staff"), updateFranchiseDetails)
router.route('/updateWallet').put(verifyToken,verifyRefreshToken, restrictTo("admin"),updateWallet)
router.route('/verifyFranchise').put(verifyToken,verifyRefreshToken, restrictTo("admin"),verifyFranchise)

module.exports = router
