const {
  getAllFranchises,
  updateStaffDetails,
  getAllStaff,
} = require("../controller/adminViewController");

const { verifyToken, verifyRefreshToken } = require("../utils/token");

const router = require("express").Router();



router
  .route("/getAllFranchises")
  .get(verifyToken, verifyRefreshToken, getAllFranchises);
router
  .route("/updateStaffDetails")
  .put(verifyToken, verifyRefreshToken, updateStaffDetails);
  
router.route("/getAllStaff").get(verifyToken, verifyRefreshToken, getAllStaff);


module.exports = router;
