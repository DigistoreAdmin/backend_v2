const { financialStatement } = require("../controller/financialStatement");
const { verifyToken, verifyRefreshToken } = require("../utils/token");
const router = require("express").Router();

router
  .route("/financialStatement")
  .post(verifyToken, verifyRefreshToken, financialStatement);

module.exports =router;