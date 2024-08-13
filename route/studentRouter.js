const { restrictTo, verifyOTP } = require("../controller/authController");
const { registerStudent,countOfFranchise } = require("../controller/studentController");
const { verifyToken, verifyRefreshToken } = require("../utils/token");

const router = require("express").Router();




router.route("/registerStudent").post(verifyToken,verifyRefreshToken, restrictTo("admin"),verifyOTP, registerStudent)
router.route("/countOfFranchise").post(verifyToken,verifyRefreshToken,countOfFranchise)




module.exports = router;  