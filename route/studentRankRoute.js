const router = require("express").Router();
const { verifyToken, verifyRefreshToken } = require("../utils/token");
const { getCollegeRank } = require("../controller/studentRankController");

router
  .route("/getCollegeRank")
  .get(verifyToken, verifyRefreshToken, getCollegeRank);
module.exports = router;
