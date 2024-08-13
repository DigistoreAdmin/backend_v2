const { restrictTo } = require("../controller/authController");
const {
  rechargePage,
  fetchMobileRechargePlans,
  circle
} = require("../controller/fixedDataController");
const {verifyToken, verifyRefreshToken} = require('../utils/token')
const router = require("express").Router();



router.route("/rechargePage").get(verifyToken,verifyRefreshToken,restrictTo('franchise'),rechargePage); //fetch all Operator in recharge

router.route("/circle").get(circle); //fetch all country and their longitude,latitude

router.route("/fetchMobileRechargePlans").get(fetchMobileRechargePlans); //fetch all plans for recharge


module.exports = router; 