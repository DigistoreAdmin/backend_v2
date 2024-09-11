const {updateFranchiseDetails, updateWallet} = require("../controller/adminUpdateController");
const { verifyToken, verifyRefreshToken } = require("../utils/token");

const router = require("express").Router();

router.route('/updateFranchiseDetails').put(verifyToken,verifyRefreshToken,updateFranchiseDetails)
router.route('/updateWallet').put(verifyToken,verifyRefreshToken,updateWallet)

module.exports = router