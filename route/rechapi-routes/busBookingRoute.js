const {
  busList,
  busStop,
  bookBusSeat,
  blockBusSeat,
} = require("../../controller/rechapi-controllers/busBookingController");

const { verifyToken, verifyRefreshToken } = require("../../utils/token");

const router = require("express").Router();

router.route("/busStop").get(verifyToken, verifyRefreshToken, busStop);
router.route("/busList").get(verifyToken, verifyRefreshToken, busList);
router
  .route("/blockBusSeat")
  .get(verifyToken, verifyRefreshToken, blockBusSeat);
router.route("/bookBusSeat").get(verifyToken, verifyRefreshToken, bookBusSeat);

module.exports = router;
