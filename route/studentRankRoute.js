const router = require('express').Router()

const { getStudentRanks } = require("../controller/studentRankController")
const { verifyToken, verifyRefreshToken } = require('../utils/token')

router.route("/getStudentranks").get(verifyToken, verifyRefreshToken, getStudentRanks)

module.exports = router