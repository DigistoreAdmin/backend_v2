const { loginUser } = require("../../controller/payout/login");
const { impsFundTransfer } = require("../../controller/payout/impsFundTransfer");
const { getBearerToken,verifyAccessToken } = require("../../controller/payout/token");

const router = require("express").Router();


router.route("/loginUser").post(loginUser);
router.route("/impsFundTransfer").post(impsFundTransfer);




module.exports = router;