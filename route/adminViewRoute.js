const { getAllFranchises } = require("../controller/adminViewController");
const { verifyToken, verifyRefreshToken } = require("../utils/token");

const router = require("express").Router();

router.route('/getAllFranchise').get(verifyToken, verifyRefreshToken, getAllFranchises)

module.exports = router