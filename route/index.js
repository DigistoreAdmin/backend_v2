const express = require("express");

const authRouter = require("../route/authRoute");
const projectRouter = require("../route/projectRoute");
const userRouter = require("../route/userRoute");
const distributorRoute = require("../route/distributorRoute");
const franchiseRouter = require("../route/franchiseRouter");
const dmtRoute = require("../route/dmtRoute");
const blobRoutes = require("../route/blobRoutes");
const studentRouter = require("../route/studentRouter");
const moneyTransferRoute = require("../route/moneyTransferRoute");
const transationHistory = require("../route/transationHistoryRoute");
const userPlanRoute = require("../route/userPlanRoute");
const fixedDataRoute = require("../route/fixedDataRoute");
const phoneRechargeRoute = require("../route/phoneRechargeRoute");
const billPaymentRoute = require("../route/billPaymentRoute");
const trainRoute = require("../route/trainRoute");
const passportRoute = require("../route/passportRoute");
const kswiftRoute = require("../route/kswiftRoute");
const busBookingRoute = require("../route/busRoutes")

const router = express.Router();

router.use("/v1/auth", authRouter);
router.use("/v1/projects", projectRouter);
router.use("/v1/users", userRouter);
router.use("/v1/distributor", distributorRoute);
router.use("/v1/franchiseRouter", franchiseRouter);
router.use("/v1/dmtRoute", dmtRoute);
router.use("/v1/studentRouter", studentRouter);
router.use("/v1/blobs", blobRoutes);
router.use("/v1/moneyTransferRoute", moneyTransferRoute);
router.use("/v1/transationHistory", transationHistory);
router.use("/v1/userPlanRoute", userPlanRoute);
router.use("/v1/fixedDataRoute", fixedDataRoute);
router.use("/v1/phoneRechargeRoute", phoneRechargeRoute);
router.use("/v1/billPaymentRoute", billPaymentRoute);
router.use("/v1/train", trainRoute);
router.use("/v1/passport", passportRoute);
router.use("/v1/kswift", kswiftRoute);
router.use("/v1/bus", busBookingRoute)


module.exports = router;
