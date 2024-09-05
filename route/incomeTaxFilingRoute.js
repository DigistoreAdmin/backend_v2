const express = require("express");
const { verifyToken, verifyRefreshToken } = require("../utils/token");
const createIncomeTaxFiling = require("../controller/incomeTaxFilingController");

const router = express.Router();

router
  .route("/incomeTaxFiling")
  .post(verifyToken, verifyRefreshToken, createIncomeTaxFiling);

module.exports = router;
