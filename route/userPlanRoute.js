const { restrictTo } = require("../controller/authController");
const {userPlan} = require("../controller/userPlanController");
const {verifyToken, verifyRefreshToken} = require('../utils/token')
const router = require("express").Router();


router.route("/userPlan").post(verifyToken,verifyRefreshToken,userPlan);


module.exports = router;


