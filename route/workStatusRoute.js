const router = require("express").Router();
const { workStatus } = require("../controller/workStatusController");
const { verifyToken, verifyRefreshToken } = require("../utils/token");

router
  .route("/workStatus")
  .put(verifyToken, verifyRefreshToken, workStatus);

module.exports = router;
