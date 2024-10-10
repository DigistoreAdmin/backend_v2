const router = require('express').Router()

const { getStudentRanks, getCollegeRank } = require("../controller/studentRankController")
const { verifyToken, verifyRefreshToken } = require('../utils/token')

router.route("/getStudentranks").get(verifyToken, verifyRefreshToken, getStudentRanks)

router.route("/getCollegeRank").get(verifyToken, verifyRefreshToken, getCollegeRank);

module.exports = router