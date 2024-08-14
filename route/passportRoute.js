const router = require("express").Router();
const {
  createPassport,
  getPlacesByZone,
} = require("../controller/passportController");
const { verifyToken, verifyRefreshToken } = require("../utils/token");

router
  .route("/createPassport")
  .post(verifyToken, verifyRefreshToken, createPassport);
router.route("/getPlacesByZone").get(getPlacesByZone);

module.exports = router;
