const { restrictTo } = require("../controller/authController");
const { updateFranchiseBlock } = require("../controller/franchiseBlock");
const { verifyToken, verifyRefreshToken } = require('../utils/token')
const router = require("express").Router();

router.route("/updateFranchiseBlock").put(verifyToken, verifyRefreshToken, restrictTo("admin"), updateFranchiseBlock);

module.exports = router;
