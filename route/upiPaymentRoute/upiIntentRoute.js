const {
  upiIntent,
} = require("../../controller/upiPaymentController/upiIntentController");
const { verifyToken, verifyRefreshToken } = require("../../utils/token");

const router = require("express").Router();

router.route("/upiIntent").post(verifyToken, verifyRefreshToken, upiIntent);

module.exports = router;
