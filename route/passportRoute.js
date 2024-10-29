const router = require("express").Router();
const {
  createPassport,
  passportUpdate,
} = require("../controller/passportController");
const { verifyToken, verifyRefreshToken } = require("../utils/token");

router
  .route("/createPassport")
  .post(verifyToken, verifyRefreshToken, createPassport);

router
  .route("/passportUpdate")
  .put(verifyToken, verifyRefreshToken, passportUpdate);

module.exports = router;
