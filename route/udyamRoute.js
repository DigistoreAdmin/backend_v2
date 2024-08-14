const router = require("express").Router();
const { udyamRegistration } = require("../controller/udyamRegisterController");
const { verifyToken, verifyRefreshToken } = require("../utils/token");

router
  .route("/udyamRegister")
  .post(verifyToken, verifyRefreshToken, udyamRegistration);

module.exports = router;
