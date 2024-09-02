const router = require("express").Router();
const { verifyToken, verifyRefreshToken } = require("../utils/token");
const { trainBooking } = require("../controller/trainController");

router
  .route("/trainBooking")
  .post(verifyToken, verifyRefreshToken, trainBooking);

module.exports = router;
