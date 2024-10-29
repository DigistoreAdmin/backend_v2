const {
  getAllFranchises,
  updateStaffDetails,
  getAllStaff,
  getFranchise,
  getStaff,
} = require("../controller/adminViewController");

const { verifyToken, verifyRefreshToken } = require("../utils/token");

const router = require("express").Router();



router
  .route("/getAllFranchises")
  .get(verifyToken, verifyRefreshToken, getAllFranchises);

router.route("/getFranchise").get(verifyToken, verifyRefreshToken, getFranchise)
  
router
  .route("/updateStaffDetails")
  .put(verifyToken, verifyRefreshToken, updateStaffDetails);
  
router.route("/getAllStaff").get(verifyToken, verifyRefreshToken, getAllStaff);

router.route("/getStaff").get(verifyToken,verifyRefreshToken,getStaff)

module.exports = router;
