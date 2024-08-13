const { authentication, restrictTo, verifyOTP } = require("../controller/authController");
const {registerDistributor,} = require("../controller/distributorController");
const { verifyToken, verifyRefreshToken } = require("../utils/token");

const router = require("express").Router();




router.route("/registerDistributor").post(verifyToken,verifyRefreshToken, restrictTo("admin"),verifyOTP, registerDistributor)



module.exports = router;  

