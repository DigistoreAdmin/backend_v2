const { restrictTo } = require("../controller/authController");
const {
  moneyTransferDetails,
  moneyTransferVerify,
  updatemoneyTransfer
} = require("../controller/moneyTransferController");
const {verifyToken, verifyRefreshToken} = require('../utils/token')
const router = require("express").Router();



router.route("/moneyTransferDetails").post(verifyToken,verifyRefreshToken,moneyTransferDetails);  /// request by franchise //

router.route('/moneyTransferVerify').get(verifyToken,verifyRefreshToken, restrictTo("admin"),moneyTransferVerify); // view by admin //

router.route('/updatemoneyTransfer').post(verifyToken,verifyRefreshToken, restrictTo("admin"),updatemoneyTransfer); // update by admin //

module.exports = router;