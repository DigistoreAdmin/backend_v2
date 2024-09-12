const {
  fetchPassport,
  fetchKswift,
  fetchStaffs,
} = require("../controller/fetchServicesController");

const { verifyToken, verifyRefreshToken } = require("../utils/token");

const router = require("express").Router();

router
  .route("/fetchPassport")
  .get(verifyToken, verifyRefreshToken, fetchPassport);

router.route("/fetchKswift").get(verifyToken, verifyRefreshToken, fetchKswift);
router.route("/fetchStaffs").get(verifyToken, verifyRefreshToken, fetchStaffs);

module.exports = router;
