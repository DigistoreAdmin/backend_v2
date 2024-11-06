const definePassportDetails = require("../db/models/passport");
const Place = require("../db/models/passportOffice");
const Franchise = require("../db/models/franchise");
const azureStorage = require("azure-storage");
const intoStream = require("into-stream");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const wallets =require("../db/models/wallet")
const transationHistories=require("../db/models/transationhistory");

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

const createPassport = catchAsync(async (req, res,next) => {
  try {

    const user = req.user;
    if (!user) {
      return next(new AppError("User not found", 401));
    }
    const franchise = await Franchise.findOne({
      where: { email: user.email }
    });

    if(!franchise){
      return next(new AppError("Franchise not found", 401));
    }
    const uniqueId = franchise.franchiseUniqueId;
    if (!uniqueId) {
      return next(new AppError("Missing unique id for the franchise", 400));
    }

    const isVerified= franchise.verified
    if(!isVerified){
      return next(new AppError("Franchise should be verified for doing passport services...",403))
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
      amount
    } = req.body;

     amount=parseInt(amount)
     const fixedPassportAmount=1750

    if(amount < fixedPassportAmount || amount >1850){
      return next(new AppError("Amount should be in the range 1750-1850",404))
    }

    const Wallet = await wallets.findOne({where:{uniqueId}})

    if(Wallet.balance < amount){
      return next(new AppError("Insufficient Franchise wallet",400))
    }

    const commissionToFranchise=amount-fixedPassportAmount
    const commissionToHo=244

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

    const newPassport = await Passport.create({
      uniqueId,
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
      proofOfIdentity: proofOfIdentityUrl,
      proofOfDob: proofOfDobUrl,
      proofOfAddress: proofOfAddressUrl,
      oldPassportCopy: oldPassportCopyUrl,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const random12DigitNumber = generateRandomNumber();
    let DSP = `DSP${random12DigitNumber}${uniqueId}`;

    let updatedBalance=await Wallet.balance-fixedPassportAmount
    await Wallet.update({balance:updatedBalance},{where:{uniqueId}})

    const newTransactionHistory=await transationHistories.create({
        transactionId:DSP,
        userName:franchise.franchiseName,
        userType:user.userType,
        service:"Passport create",
        status:"success",
        amount,
        franchiseCommission:commissionToFranchise,
        adminCommission:commissionToHo,
        walletBalance:updatedBalance,
        uniqueId:franchise.franchiseUniqueId,
        customerNumber:phoneNumber,
    })
    res.status(201).json({ newPassport,newTransactionHistory });
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

const passportUpdate = catchAsync(async (req, res) => {
  try {
    const { phoneNumber, passportAppointmentDate, username, password,rejectReason } =
      req.body;
    const { passportFile } = req.files;
    const user=req.user

    // if (!req.files) {
    //   throw new AppError("Files not uploaded", 400);
    // }

    console.log("body:", req.body);
    console.log("files:", req.files);

    // Check for required fields
    if (!phoneNumber) {
      return res
        .status(404)
        .json({ message: "Missing required field: mobileNumber" });
    }

    // Define passport model
    const passportDetails = definePassportDetails();

    // Find the passport record by mobile number
    const passportRecord = await passportDetails.findOne({
      where: { phoneNumber },
    });

    if (!passportRecord) {
      return res.status(404).json({ message: "Passport record not found" });
    }

    // Helper function to upload files (similar to loanStatus)
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

    if(rejectReason){
      passportRecord.rejectReason=rejectReason
      passportRecord.status="rejected"
      await passportRecord.save();

      const uniqueId=passportRecord.uniqueId
      const franchise = await Franchise.findOne({
        where: { franchiseUniqueId: uniqueId }
      });
      const Wallet = await wallets.findOne({where:{uniqueId}})
      const fixedPassportAmount=1750
      const updatedBalance=parseInt(Wallet.balance)+fixedPassportAmount
      Wallet.balance=updatedBalance
      await Wallet.save()

      const random12DigitNumber = generateRandomNumber();
      let DSP = `DSP${random12DigitNumber}${uniqueId}`;

      const newTransactionHistory=await transationHistories.create({
        transactionId:DSP,
        userName:franchise.franchiseName,
        userType:user.userType,
        service:"Passport rejected",
        status:"fail",
        amount:fixedPassportAmount,
        walletBalance:updatedBalance,
        uniqueId:franchise.franchiseUniqueId,
        customerNumber:phoneNumber,
    })

    return res.status(200).json({
      message: "Passport details updated successfully",
      newTransactionHistory
    });
    }

    if(!passportFile){
      return res.status(404).json({ message: "Passport file is required" });
    }
    const passportFileUrl = await uploadFile(passportFile);


    passportAppointmentDate
      ? (passportRecord.passportAppointmentDate = passportAppointmentDate)
      : null;

    username ? (passportRecord.username = username) : null;
    password ? (passportRecord.password = password) : null;
    passportFileUrl ? (passportRecord.passportFile = passportFileUrl) : null;

    await passportRecord.save();

    res.status(200).json({
      message: "Passport details updated successfully",
      passportRecord,
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "An error occurred", error: error.message });
  }
});

function generateRandomNumber() {
  const randomNumber =
    Math.floor(Math.random() * (999999999999 - 100000000000 + 1)) +
    100000000000;
  return randomNumber.toString();
}

module.exports = {
  createPassport,
  getPlacesByZone,
  passportUpdate,
};
