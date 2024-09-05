const router = require("express").Router();
const { createPassport } = require("../controller/passportController");
const { verifyToken, verifyRefreshToken } = require("../utils/token");

router
  .route("/createPassport")
  .post(verifyToken, verifyRefreshToken, createPassport);

module.exports = router;
