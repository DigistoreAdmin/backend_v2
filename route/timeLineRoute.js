const router = require("express").Router();
const { verifyToken, verifyRefreshToken } = require("../utils/token");
const { timeLineController } = require("../controller/timeLineController");

router
  .route("/timeLine")
  .get(verifyToken, verifyRefreshToken, timeLineController);

module.exports = router;
