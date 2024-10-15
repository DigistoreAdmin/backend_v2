const { Sequelize } = require("sequelize");
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
// const se = sequelize.produc

// const generateToken = (payload) => {
//   return jwt.sign(payload, process.env.JWT_SECRET_KEY, {
//     expiresIn: process.env.JWT_EXPIRES_IN,
//   });
// };
const Circles = require("../db/models/circle");
const azureStorage = require("azure-storage");
const intoStream = require("into-stream");

const containerName = "imagecontainer";
const blobService = azureStorage.createBlobService(
  process.env.AZURE_STORAGE_CONNECTION_STRING
);
// };

const uploadBlob = async (file) => {
  return new Promise((resolve, reject) => {
    const blobName = file.name;
    const stream = intoStream(file.data);
    const streamLength = file.data.length;

    blobService.createBlockBlobFromStream(
      containerName,
      blobName,
      stream,
      streamLength,
      (err) => {
        if (err) {
          return reject(err);
        }
        const blobUrl = blobService.getUrl(containerName, blobName);
        resolve(blobUrl);
      }
    );
  });
};

const sendOtpPhoneNumber = catchAsync(async (req, res, next) => {
  const { phoneNumber } = req.body;
  console.log(phoneNumber);

  delete req.session.otp;
  delete req.session.otpExpiration;

  if (!phoneNumber) {
    throw new AppError("phoneNumber is needed", 400);
  }

  if (typeof phoneNumber !== "number" || !Number.isInteger(phoneNumber)) {
    console.log("phoneNumber validation failed:", phoneNumber);
    return next(new AppError("phoneNumber must be an integer number", 400));
  }

  const result = await user.findOne({ where: { phoneNumber: phoneNumber } });

  if (result) {
    return next(new AppError("phoneNumber already exist", 401));
  }

  newOtp = generateOTP(phoneNumber);
  console.log("otp", newOtp);
  req.session.otp = newOtp;
  req.session.phoneNumber = phoneNumber;
  req.session.otpExpiration = new Date(Date.now() + 15 * 60 * 1000);

  if (newOtp == "123456") {
    res
      .status(200)
      .json({ success: true, message: "fixed OTP 123456 sent successfully" });
  } else {
    await sendOTP(phoneNumber, newOtp);
    res.status(200).json({ success: true, message: "OTP sent successfully" });
  }
});

const sendOtpEmail = catchAsync(async (req, res, next) => {
  const { email } = req.body;

  delete req.session.otp;
  delete req.session.otpExpiration;

  if (!email) {
    throw new AppError("email is needed", 400);
  }

  const result = await Contact.findOne({ where: { email } });
  if (result) {
    return next(new AppError("email already exist", 401));
  }

  newOtp = Math.floor(100000 + Math.random() * 900000);

  const sent = await mail.sendMail(email, newOtp);

  console.log(newOtp);

  req.session.otp = newOtp;

  req.session.otpExpiration = new Date(Date.now() + 5 * 60 * 1000);

  if (sent) {
    console.log("otp sent successfully!!");
    return res.status(200).json({
      status: "otp send successfully",
      // data: newOtp,
    });
  }
});

let isverified;

const verifyOtp = catchAsync(async (req, res, next) => {
  const { otp, phoneNumber } = req.body;

  if (
    !req.session.otp ||
    !req.session.otpExpiration ||
    !req.session.phoneNumber
  ) {
    return res.status(400).json({
      status: "error",
      message: "Session data missing",
    });
  }

  if (new Date() > new Date(req.session.otpExpiration)) {
    return res.status(400).json({
      status: "error",
      message: "OTP has expired",
    });
  }

  if (otp == req.session.otp && phoneNumber === req.session.phoneNumber) {
    isverified = true;
    //  delete session.otp
    //  delete session.phoneNumber
    //  delete session.otpExpiration

    return res.status(200).json({
      status: "success",
      message: "OTP verified successfully",
    });
  } else {
    isverified = false;
    return res.status(400).json({
      status: "error",
      message: "Invalid OTP or phone number",
    });
  }
});

const creatFranchise = catchAsync(async (req, res, next) => {
  const body = req.body;
  const transaction = await sequelize.transaction();

  try {
    //
    if (!isverified) {
      throw new AppError("OTP needs to be verified", 401);
    }
    console.log("type", typeof req.session.phoneNumber);
    console.log("type22", typeof body.phoneNumber);
    console.log("type22", typeof Number(body.phoneNumber));
    if (
      !req.session.otp ||
      !req.session.phoneNumber ||
      req.session.phoneNumber !== Number(body.phoneNumber)
    ) {
      throw new AppError("OTP expired or phone number not correct", 401);
    }
    //

    const existingPhoneNumber = await user.findOne({
      where: { phoneNumber: body.phoneNumber },
      transaction, // Ensure transaction is passed here
    });
    if (existingPhoneNumber) {
      await transaction.rollback();
      return res
        .status(400)
        .json({ success: false, message: "Phone number already exists" });
    }

    const existingMail = await user.findOne({
      where: { email: body.email },
      transaction, // Ensure transaction is passed here
    });
    if (existingMail) {
      await transaction.rollback();
      return res
        .status(400)
        .json({ success: false, message: "Email already exists" });
    }
    console.log(
      "typeeee",
      typeof body.referredBy,
      typeof body.referredFranchiseName,
      typeof body.referredFranchiseCode,
      typeof body.onBoardedBy,
      typeof body.onBoardedPersonId,
      typeof body.onBoardedPersonName
    );
    const id = `DSP${body.phoneNumber}`;
    const aadhaarPicFrontUrl = req.files && req.files.aadhaarPicFront ? await uploadBlob(req.files.aadhaarPicFront) : null;
    const aadhaarPicbackUrl = req.files && req.files.aadhaarPicback ? await uploadBlob(req.files.aadhaarPicback) : null;
    const panPicUrl = req.files && req.files.panPic ? await uploadBlob(req.files.panPic) : null;
    const bankPassbookPicUrl = req.files && req.files.bankPassbookPic ? await uploadBlob(req.files.bankPassbookPic) : null;
    const shopPicUrl = req.files && req.files.shopPic ? await uploadBlob(req.files.shopPic) : null;
    console.log("ssss",body.digitalElements);
    console.log("ssss",typeof(body.digitalElements));
    const franchiseData = await Franchise.create(
      {
        franchiseUniqueId: id,
        ownerName: body.ownerName,
        franchiseName: body.franchiseName,
        businessType: body.businessType,
        phoneNumber: Number(body.phoneNumber),
        email: body.email,
        password: body.password,
        gender: body.gender,
        dateOfBirth: body.dateOfBirth,
        franchiseAddressLine1: body.franchiseAddressLine1,
        franchiseAddressLine2: body.franchiseAddressLine2,
        state: body.state,
        district: body.district,
        pinCode: Number(body.pinCode),
        postOffice: body.postOffice,
        panchayath: body.panchayath,
        ward: body.ward,
        digitalElements: body.digitalElements,
        panCenter: body.panCenter,
        accountNumber: Number(body.accountNumber),
        accountName: body.accountName,
        bank: body.bank,
        branchName: body.branchName,
        ifscCode: body.ifscCode,
        aadhaarNumber: Number(body.aadhaarNumber),
        panNumber: body.panNumber,
        aadhaarPicFront: aadhaarPicFrontUrl,
        aadhaarPicback: aadhaarPicbackUrl,
        panPic: panPicUrl,
        bankPassbookPic: bankPassbookPicUrl,
        shopPic: shopPicUrl,
        referredBy: body.referredBy,
        referredFranchiseName: body.referredFranchiseName,
        referredFranchiseCode: body.referredFranchiseCode,
        onBoardedBy: body.onBoardedBy,
        onBoardedPersonId: body.onBoardedPersonId,
        onBoardedPersonName: body.onBoardedPersonName,
      },
      { transaction }
    ); // Ensure transaction is passed here

    if (!franchiseData) {
      await transaction.rollback();
      throw new AppError("Failed to create the franchise", 400);
    }

    const userDetails = await user.create(
      {
        userType: "franchise",
        phoneNumber: body.phoneNumber,
        email: body.email,
        password: body.password,
      },
      { transaction }
    ); // Ensure transaction is passed here

    if (!userDetails) {
      await transaction.rollback();
      return res
        .status(400)
        .json({ success: false, message: "Failed to create user" });
    }

    const wallet = await Wallet.create(
      {
        uniqueId: franchiseData.franchiseUniqueId,
      },
      { transaction }
    ); // Ensure transaction is passed here

    if (!wallet) {
      await transaction.rollback();
      return res
        .status(400)
        .json({ success: false, message: "Failed to create wallet" });
    }

    delete req.session.otp;
    delete req.session.otpExpiration;
    delete req.session.phoneNumber;

    await transaction.commit();
    res.clearCookie("connect.sid", { path: "/" });
    return res.status(201).json({
      status: "Registration success",
    });
  } catch (error) {
    console.log("errorr", error);
    await transaction.rollback();
    return next(error);
  }
});

const updateFranchise = catchAsync(async (req, res, next) => {
  try {

    const transaction = await sequelize.transaction();
    const users = req.user;

    console.log("ser.franchiseUniqueId", users.email)
    console.log("User", users)

    const franchise = await Franchise.findOne({
      where: { email: users.email },
    });

    if (!franchise) {
      return res
        .status(404)
        .json({ success: false, message: "Franchise not found" });
    }

    const franchiseUniqueId = franchise.franchiseUniqueId

    console.log("Franchisse", franchiseUniqueId)
    console.log("email", franchise.email)
    
    const {
      email,
      franchiseAddressLine1,
      franchiseAddressLine2,
      state,
      district,
      pinCode,
      postOffice,
      panchayath,
      ward,
      digitalElements,
      panCenter,
      businessType,
    } = req.body;
    
      const shopPic = req?.files?.shopPic

    const uploadFile = async (file) => {
      if (file) {
        try {
          return await uploadBlob(file);
        } catch (error) {
          console.error(`Error uploading file ${file.name}:`, error);
          // return null;
        }
      } else {
        console.error('File is missing:', file);
        // return null;
      }
    };

    const shopPicUrl = await uploadFile(shopPic);

    const updatedFranchise = await Franchise.update(
      {
        email,
        franchiseAddressLine1,
        franchiseAddressLine2,
        state,
        district,
        pinCode,
        postOffice,
        panchayath,
        ward,
        digitalElements,
        panCenter,
        businessType,
        shopPic: shopPicUrl,
      },
      {
        where: { franchiseUniqueId: franchiseUniqueId },
      },
      transaction,
    );

    if (!updatedFranchise) {
      await transaction.rollback();
      throw new AppError("Failed to update the franchise", 400);
    }

    const updateUser = await user.update(
      {
        email,
      },
      {
        where: {
          email: franchise.email,
          phoneNumber: franchise.phoneNumber,
        },
      },
      transaction,
    )

    if (!updateUser){
      await transaction.rollback();
      throw new AppError("Failed to update user details", 400);
    }

    const updatedFranchises = await Franchise.findOne({
      where: { franchiseUniqueId: franchiseUniqueId },
    });

    await transaction.commit();
    return res.status(200).json({
      success: true,
      message: "Franchise updated successfully",
      updatedFranchises,
    });
  } catch (error) {
    console.error("Error:", error);
    return next(new AppError(error.message, 500));
  }
});

const wallet = catchAsync(async (req, res, next) => {
  try {
    const user = req.user;
    // console.log("e",user.email);

    const Data = await Franchise.findOne({ where: { email: user.email } });
    // console.log("w",Data.id);
    const walletData = await Wallet.findOne({
      where: { uniqueId: Data.franchiseUniqueId },
    });
    // console.log("w",walletData);

    res.status(200).json({ wallet: walletData });
  } catch (error) {
    // Handle errors
    console.error("Error fetching wallet data:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

function generateRandomNumber() {
  const randomNumber =
    Math.floor(Math.random() * (999999999999 - 100000000000 + 1)) +
    100000000000;
  return randomNumber.toString();
}

module.exports = {
  sendOtpPhoneNumber,
  verifyOtp,
  sendOtpEmail,
  creatFranchise,
  wallet,
  updateFranchise
};
