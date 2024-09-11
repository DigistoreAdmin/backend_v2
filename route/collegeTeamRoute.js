const { bestTeamInCollege, bestCollege, bestTeam } = require("../controller/collegeTeamController");
const { verifyToken, verifyRefreshToken } = require("../utils/token");


const router = require("express").Router();


router.route("/bestTeamInCollege").get(verifyToken,verifyRefreshToken,bestTeamInCollege)
router.route("/bestCollege").get(verifyToken,verifyRefreshToken,bestCollege)
router.route("/bestTeam").get(verifyToken,verifyRefreshToken,bestTeam)


module.exports = router;