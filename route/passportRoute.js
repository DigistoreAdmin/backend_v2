const router = require("express").Router();
const {
  createPassport,
  passportUpdateReject,
  passportUpdateComplete
} = require("../controller/passportController");
const { verifyToken, verifyRefreshToken } = require("../utils/token");

router
  .route("/createPassport")
  .post(verifyToken, verifyRefreshToken, createPassport);

router
  .route("/passportUpdateReject")
  .put(verifyToken, verifyRefreshToken, passportUpdateReject);

  router
  .route("/passportUpdateComplete")
  .put(verifyToken, verifyRefreshToken, passportUpdateComplete);

module.exports = router;
