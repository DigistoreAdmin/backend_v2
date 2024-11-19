
  const { percentageCountOfServices } = require("../../controller/accountantController/percentageCountController");
const { verifyToken, verifyRefreshToken } = require("../../utils/token");
  
  const router = require("express").Router();
  
  router.route("/percentageCountOfServices").get(verifyToken, verifyRefreshToken, percentageCountOfServices);

  
  module.exports = router;
  