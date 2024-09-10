const express = require("express");
const { verifyToken, verifyRefreshToken } = require("../utils/token");
const {
  createPartnerShipDeedPreperation,
} = require("../controller/partnerShipDeedPreperationController");
const router = express.Router();

router
  .route("/partnerShipDeedPreperation")
  .post(verifyToken, verifyRefreshToken, createPartnerShipDeedPreperation);

module.exports = router;
