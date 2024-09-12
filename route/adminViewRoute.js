const {getAllFranchises, updateStaffDetails} = require("../controller/adminViewController");
const { verifyToken, verifyRefreshToken } = require("../utils/token");

const router = require("express").Router();

router.route('/adminView').get(verifyToken,verifyRefreshToken,getAllFranchises)
router.route('/updateStaffDetails').put(verifyToken,verifyRefreshToken,updateStaffDetails)

module.exports = router