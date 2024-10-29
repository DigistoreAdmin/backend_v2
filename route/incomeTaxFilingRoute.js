const express = require("express");
const { verifyToken, verifyRefreshToken } = require("../utils/token");
const {createIncomeTaxFiling, incometaxUpdate } = require("../controller/incomeTaxFilingController");

const router = express.Router();

router
  .route("/incomeTaxFiling")
  .post(verifyToken, verifyRefreshToken, createIncomeTaxFiling);
  
router
  .route("/incometaxUpdate")
  .put(verifyToken, verifyRefreshToken, incometaxUpdate)

module.exports = router;
