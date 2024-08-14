const { Sequelize } = require("sequelize");

// const Contact = require("../db/models/contact");
// const OTP = require("../db/models/otp");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const sms = require("../config/sms");
const mail = require("../config/emailOtp");
const Franchise = require("../db/models/franchise");
const userPlans = require("../db/models/userplan");
const Operator = require("../db/models/operator");
const Tokens = require("../utils/token");
const axios = require("axios");
const Wallet = require("../db/models/wallet");

const defineMoneyTransferDetails = require("../db/models/moneytransferdetails");
const dmtUserData = require("../db/models/dmtuserdata");
const user = require("../db/models/user");
const { generateOTP, sendOTP } = require("../utils/otpUtils");
const transationHistory = require("../db/models/transationhistory");
const transationHistories = require("../db/models/transationhistory");
const sequelize = require("../config/database");
const walletsModel = require("../db/models/wallet");

/// request by franchise //

const moneyTransferDetails = catchAsync(async (req, res, next) => {
  const user = req.user;
  // console.log(user.id);
  const body = req.body;
  // console.log("bo",body);
  if (!req.body) {
    return next(new AppError(" add all details", 400));
  }
  const Data = await Franchise.findOne({ where: { email: user.email } });
  if (!Data) {
    return next(new AppError(" data not fetch", 400));
  }

  const random12DigitNumber = generateRandomNumber();
  let DSP = `DSP${random12DigitNumber}${Data.id}`;
  console.log("DSP", DSP);

  const transactionType = body.transactionType;
  console.log(transactionType);

  const moneyTransferDetailsModel = defineMoneyTransferDetails(transactionType);

  const data = await moneyTransferDetailsModel.create({
    userName: Data.franchiseName,
    uniqueId: Data.franchiseUniqueId,
    transationId: DSP,
    fromAcc: body.fromAcc,
    toAcc: body.toAcc,
    fromUpiId: body.fromUpiId,
    toUpiId: body.toUpiId,
    executiveName: body.executiveName,
    executiveId: body.executiveId,
    referenceNo: body.referenceNo,
    remark: body.remark,
    date: body.date,
    amount: body.amount,
    transactionType: body.transactionType,
    documentPic: body.documentPic,
  });
  if (data) {
    return res.status(201).json({
      status: "successfully add details",
    });
  } else {
    return next(new AppError(" failed to send", 400));
  }
});

const moneyTransferVerify = catchAsync(async (req, res, next) => {
  try {
    const moneyTransferDetailsModel = defineMoneyTransferDetails();
    const data = await moneyTransferDetailsModel.findAll();
    // console.log("d",data);

    return res.status(200).json({ data: data, count: data.length });
  } catch (error) {
    next(error);
  }
});

const updatemoneyTransfer = catchAsync(async (req, res, next) => {
  const transaction = await sequelize.transaction();
  try {
    const body = req.body;

    if (!body) {
      // await transaction.rollback();
      return next(new AppError("Please provide details", 400));
    }

    const moneyTransferDetailsModel = defineMoneyTransferDetails();
    // const walletsModel = defineWalletsModel(); // Ensure you have this defined

    const data = await moneyTransferDetailsModel.findOne({
      where: { transationId: body.transactionId },
      transaction,
    });
    const walletBalance = await walletsModel.findOne({
      where: { uniqueId: body.id },
      transaction,
    });

    if (!data && !walletBalance) {
      await transaction.rollback();
      return next(new AppError("Data not fetched", 400));
    }
    if (body.status == "approved") {
      console.log("status", data.status);
      if (data.status == "approved") {
        // await transaction.rollback();
        return next(new AppError("This is already approved", 400));
      }

      const updated = await moneyTransferDetailsModel.update(
        { status: body.status },
        { where: { transationId: body.transactionId }, transaction }
      );

      console.log("f", updated);

      let amount = parseFloat(walletBalance.balance) + parseFloat(data.amount);

      const addCashToWallet = await walletsModel.update(
        { balance: amount },
        { where: { uniqueId: body.id }, transaction }
      );

      // const random12DigitNumber = generateRandomNumber();
      // let DSP = `DSP${random12DigitNumber}${Data.id}`;
      console.log("trd", body.transactionId);
      const transatinH = await transationHistories.create(
        {
          transactionId: body.transactionId,
          uniqueId: data.uniqueId,
          userName: data.userName,
          userType: "franchise",
          service: "wallet creadited by admin",
          status: "success",
          amount: data.amount,
          walletBalance: amount,
        },
        { transaction }
      );

      if (updated && walletBalance && addCashToWallet && transatinH) {
        await transaction.commit();
        return res.status(200).json({ status: "Approved Successfully" });
      } else {
        await transaction.rollback();
        return next(new AppError("Failed to approve", 400));
      }
    } else if (body.status == "rejected") {
      // const data = await moneyTransferDetailsModel.findOne({
      //   where: { transationId: body.transactionId },
      //   transaction,
      // });
      // if (!data) {
      //   // await transaction.rollback();
      //   return next(new AppError("Data not fetched", 400));
      // }
      if (data.status == "rejected") {
        // await transaction.rollback();
        return next(new AppError("Already rejected", 400));
      }
      console.log(data.status);
      const updated = await moneyTransferDetailsModel.update(
        { status: body.status },
        { where: { transationId: body.transactionId }, transaction }
      );
      console.log("f", updated);
      const transatinH = await transationHistories.create(
        {
          transactionId: body.transactionId,
          uniqueId: data.uniqueId,
          userName: data.userName,
          userType: "franchise",
          service: "wallet payment rejected by admin",
          status: "fail",
          amount: 0.0,
          walletBalance: walletBalance.balance,
        },
        { transaction }
      );

      if (updated && transatinH) {
        await transaction.commit();
        return res.status(200).json({ status: "Rejected Successfully" });
      } else {
        await transaction.rollback();
        return next(new AppError("Failed to reject", 400));
      }
    } else {
      // await transaction.rollback();
      return next(new AppError("Invalid request", 400));
    }
  } catch (error) {
    await transaction.rollback();
    console.log(error);
    next(error);
  }
});

function generateRandomNumber() {
  const randomNumber =
    Math.floor(Math.random() * (999999999999 - 100000000000 + 1)) +
    100000000000;
  return randomNumber.toString();
}

module.exports = {
  moneyTransferDetails,
  moneyTransferVerify,
  updatemoneyTransfer,
};