const router = require("express").Router();
const { bestTeam } = require("../controller/studentTeamController");
// const { verifyToken, verifyRefreshToken } = require("../utils/token");

router.route("/bestTeam").get(bestTeam);

module.exports = router;
