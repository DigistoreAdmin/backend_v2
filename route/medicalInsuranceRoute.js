const {
  medicalInsuranceCreate,
} = require("../controller/medicalInsuranceController");
const { verifyToken, verifyRefreshToken } = require("../utils/token");
const router = require("express").Router();

router
  .route("/medicalInsurance")
  .post(verifyToken, verifyRefreshToken, medicalInsuranceCreate);

module.exports = router;
