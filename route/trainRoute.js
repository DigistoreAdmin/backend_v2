const router = require("express").Router();
const { verifyToken, verifyRefreshToken } = require("../utils/token");
const { trainBooking, trainBookingUpdate } = require("../controller/trainController");

router
  .route("/trainBooking")
  .post(verifyToken, verifyRefreshToken, trainBooking);

  router.route("/updateTrainBooking").put(verifyToken,verifyRefreshToken,trainBookingUpdate)

module.exports = router;
