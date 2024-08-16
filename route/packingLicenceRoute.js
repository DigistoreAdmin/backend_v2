const express = require("express");
const { verifyToken, verifyRefreshToken } = require("../utils/token");
const {
  createPackingLicence,
} = require("../controller/packingLicenceController");
const router = express.Router();

router
  .route("/packingLicence")
  .post(verifyToken, verifyRefreshToken, createPackingLicence);

module.exports = router;
