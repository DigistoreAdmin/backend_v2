const router = require("express").Router();
const { createStaffs } = require("../controller/staffController");

router.route("/createStaff").post(createStaffs);

module.exports = router;
