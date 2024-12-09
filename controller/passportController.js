const definePassportDetails = require("../db/models/passport");
const Place = require("../db/models/passportOffice");
const Franchise = require("../db/models/franchise");
const azureStorage = require("azure-storage");
const intoStream = require("into-stream");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const wallets =require("../db/models/wallet")
const transationHistories=require("../db/models/transationhistory");
const { Op } = require("sequelize");

const containerName = "imagecontainer";
const blobService = azureStorage.createBlobService(
  process.env.AZURE_STORAGE_CONNECTION_STRING
);

const uploadBlob = (file) => {
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
          return reject(`Error uploading file ${blobName}: ${err.message}`);
        }
        const blobUrl = blobService.getUrl(containerName, blobName);
        resolve(blobUrl);
      }
    );
  });
};

const createPassport = catchAsync(async (req, res, next) => {
  try {
    const user = req.user;
    if (!user) {
      return next(new AppError("User not found", 401));
    }
    const franchise = await Franchise.findOne({
      where: { email: user.email },
    });

    if (!franchise) {
      return next(new AppError("Franchise not found", 401));
    }
    const uniqueId = franchise.franchiseUniqueId;
    if (!uniqueId) {
      return next(new AppError("Missing unique id for the franchise", 400));
    }

    const isVerified = franchise.verified;
    if (!isVerified) {
      return next(
        new AppError(
          "Franchise should be verified for doing passport services...",
          403
        )
      );
    }

    let {
      passportRenewal,
      oldPassportNumber,
      customerName,
      email,
      phoneNumber,
      educationQualification,
      personalAddress,
      maritalStatus,
      spouseName,
      employmentType,
      birthPlace,
      identificationMark1,
      identificationMark2,
      policeStation,
      village,
      emergencyContactPerson,
      emergencyContactNumber,
      emergencyContactAddress,
      passportOfficePreference,
      appointmentDatePreference1,
      appointmentDatePreference2,
      appointmentDatePreference3,
      amount,
    } = req.body;

    amount = parseInt(amount);
    const fixedPassportAmount = 1750;

    if (amount < fixedPassportAmount || amount > 1850) {
      return next(new AppError("Amount should be in the range 1750-1850", 404));
    }

    const Wallet = await wallets.findOne({ where: { uniqueId } });

    if (Wallet.balance < fixedPassportAmount) {
      return next(new AppError("Insufficient Franchise wallet", 400));
    }

    const commissionToFranchise = amount - fixedPassportAmount;
    const commissionToHo = 244;

    if (!req.files) {
      throw new AppError("Files not uploaded", 400);
    }

    const proofOfIdentityUrl = await uploadBlob(req.files.proofOfIdentity);
    const proofOfDobUrl = await uploadBlob(req.files.proofOfDob);
    const proofOfAddressUrl = await uploadBlob(req.files.proofOfAddress);
    let oldPassportCopyUrl = null;
    if (passportRenewal === "true") {
      oldPassportCopyUrl = await uploadBlob(req.files.oldPassportCopy);
    }

    const Passport = definePassportDetails(maritalStatus, passportRenewal);

    const getCurrentDate = () => {
      const date = new Date();
      return `${date.getDate().toString().padStart(2, "0")}${(
        date.getMonth() + 1
      )
        .toString()
        .padStart(2, "0")}${date.getFullYear()}`;
    };

    const currentDate = getCurrentDate();
    const code = "PAS";
    const lastPassport = await Passport.findOne({
      where: {
        workId: {
          [Op.like]: `${currentDate}${code}%`,
        },
      },
      order: [["createdAt", "DESC"]],
    });

    let newIncrement = "001";
    if (lastPassport) {
      const lastIncrement = parseInt(lastPassport.workId.slice(-3));
      newIncrement = (lastIncrement + 1).toString().padStart(3, "0");
    }

    workId = `${currentDate}${code}${newIncrement}`;

    const newPassport = await Passport.create({
      uniqueId,
      oldPassportNumber,
      customerName,
      email,
      phoneNumber,
      workId,
      educationQualification,
      personalAddress,
      maritalStatus,
      spouseName,
      employmentType,
      birthPlace,
      identificationMark1,
      identificationMark2,
      policeStation,
      village,
      emergencyContactPerson,
      emergencyContactNumber,
      emergencyContactAddress,
      passportOfficePreference,
      appointmentDatePreference1,
      appointmentDatePreference2,
      appointmentDatePreference3,
      proofOfIdentity: proofOfIdentityUrl,
      proofOfDob: proofOfDobUrl,
      proofOfAddress: proofOfAddressUrl,
      oldPassportCopy: oldPassportCopyUrl,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    let updatedBalance = (await Wallet.balance) - fixedPassportAmount;
    await Wallet.update({ balance: updatedBalance }, { where: { uniqueId } });

    const newTransactionHistory = await transationHistories.create({
      transactionId: workId,
      userName: franchise.franchiseName,
      userType: user.userType,
      service: "Passport",
      status: "pending",
      amount: fixedPassportAmount,
      franchiseCommission: commissionToFranchise,
      adminCommission: commissionToHo,
      walletBalance: updatedBalance,
      uniqueId: franchise.franchiseUniqueId,
      customerNumber: phoneNumber,
      commissionType: "cash",
    });
    res.status(201).json({ newPassport, newTransactionHistory });
  } catch (error) {
    console.error("Error creating passport:", error);
    res.status(500).json({ error: "Failed to create passport" });
  }
});

const getPlacesByZone = catchAsync(async (req, res) => {
  try {
    const { zone } = req.query;
    const whereClause = zone ? { zone } : {};

    const places = await Place.findAll({ where: whereClause });

    if (!places || places.length === 0) {
      return res.status(404).json({ error: "No places found" });
    }

    res.json(places);
  } catch (error) {
    console.error("Error fetching places:", error);
    res.status(500).json({ error: "Failed to fetch places" });
  }
});

const passportUpdateReject = catchAsync(async (req, res, next) => {
  try {
    const {  rejectReason, workId } = req.body;

    if(!workId || !rejectReason){
      return res.status(400).json({ message: "WorkId and Reject reason are mandatory" });
    }

    const passportDetails = definePassportDetails();

    const passportRecord = await passportDetails.findOne({
      where: {  workId }
    });

    if (!passportRecord) {
      return res.status(404).json({ message: "Passport record not found" });
    }

    passportRecord.rejectReason = rejectReason;
    passportRecord.status = "rejected";
    await passportRecord.save();

    const Wallet = await wallets.findOne({ where: { uniqueId:passportRecord.uniqueId } });
    if(!Wallet){
      return res.status(404).json({ message: "Wallet data not found" });
    }
    const fixedPassportAmount = 1750;
    const updatedBalance = parseInt(Wallet.balance) + fixedPassportAmount;
    Wallet.balance = updatedBalance;
    await Wallet.save();

    await transationHistories.update(
      {
        service: "Passport",
        status: "fail",
        walletBalance: updatedBalance,
        franchiseCommission: 0.0,
        adminCommission: 0.0,
      },
      { where: { transactionId: workId } }
    );

    return res.status(200).json({
      message: "Passport rejected successfully",
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({
        message: "An error occurred in rejecting passport",
        error: error.message,
      });
  }
});

const passportUpdateComplete = catchAsync(async (req, res) => {
  try {
    const {
      workId,
      passportAppointmentDate,
      username,
      password,
    } = req.body;
    const { passportFile } = req.files;
    const user = req.user;

    if (!workId) {
      return res
        .status(404)
        .json({ message: "Missing required field: workId" });
    }

    const passportDetails = definePassportDetails();

    const passportRecord = await passportDetails.findOne({
      where: { workId },
    });

    if (!passportRecord) {
      return res.status(404).json({ message: "Passport record not found" });
    }

    const uploadFile = async (file) => {
      if (file) {
        try {
          return await uploadBlob(file);
        } catch (error) {
          console.error(`Error uploading file ${file.name}:`, error);
          return null;
        }
      }
    };

    if (!passportFile) {
      return res.status(404).json({ message: "Passport file is required" });
    }
    const passportFileUrl = await uploadFile(passportFile);

    passportAppointmentDate
      ? (passportRecord.passportAppointmentDate = passportAppointmentDate)
      : null;

    username ? (passportRecord.username = username) : null;
    password ? (passportRecord.password = password) : null;
    passportFileUrl ? (passportRecord.passportFile = passportFileUrl) : null;
    passportRecord.status="completed"

    const completedPassport= await passportRecord.save();

    await transationHistories.update(
      {
        status: "success",
      },
      { where: { transactionId: workId } }
    );

    res.status(200).json({
      message: "Passport completed successfully",
      completedPassport,
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({
        message: "An error occurred while completing passport",
        error: error.message,
      });
  }
});

module.exports = {
  createPassport,
  getPlacesByZone,
  passportUpdateReject,
  passportUpdateComplete,
};
