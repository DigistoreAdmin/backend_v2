const Distributor = require("../db/models/distributor");
const User = require("../db/models/user");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const { generateOTP, sendOTP } = require("../utils/otpUtils");
const otpStorage = require("../utils/otpStorage");
const sequelize = require("../config/database");
const azureStorage = require("azure-storage");
const intoStream = require("into-stream");

const containerName = "imagecontainer";
const blobService = azureStorage.createBlobService(
  process.env.AZURE_STORAGE_CONNECTION_STRING
);

const registerDistributor = async (req, res) => {
  const user = req.user;
  const body = req.body;

  console.log("req.files.aadhaarFrontImage", req.files.aadhaarFrontImage);
  console.log("req.files.aadhaarBackImage", req.files.aadhaarBackImage);
  console.log("req.files.panCardImage", req.files.panCardImage);
  console.log("req.files.bankPassbookImage", req.files.bankPassbookImage);

  const transaction = await sequelize.transaction();

  try {
    const phoneNumber = await User.findOne({
      where: { phoneNumber: body.mobileNumber },
      transaction,
    });
    if (phoneNumber) {
      await transaction.rollback();
      return res
        .status(400)
        .json({ success: false, message: "Phone number already exists" });
    }

    const mail = await User.findOne({
      where: { email: body.email },
      transaction,
    });
    if (mail) {
      await transaction.rollback();
      return res
        .status(400)
        .json({ success: false, message: "Email already exists" });
    }

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
              return reject(err);
            }
            const blobUrl = blobService.getUrl(containerName, blobName);
            resolve(blobUrl);
          }
        );
      });
    };

    const aadhaarFrontImage = req.files.aadhaarFrontImage
      ? await uploadBlob(req.files.aadhaarFrontImage)
      : null;
    const aadhaarBackImage = req.files.aadhaarBackImage
      ? await uploadBlob(req.files.aadhaarBackImage)
      : null;
    const panCardImage = req.files.panCardImage
      ? await uploadBlob(req.files.panCardImage)
      : null;
    const bankPassbookImage = req.files.bankPassbookImage
      ? await uploadBlob(req.files.bankPassbookImage)
      : null;

    const data = await User.create(
      {
        userType: "distributor",
        phoneNumber: body.mobileNumber,
        email: body.email,
        password: body.password,
      },
      { transaction }
    );

    if (!data) {
      await transaction.rollback();
      return res
        .status(400)
        .json({ error: false, message: "Failed to create user" });
    }

    const newDistributor = await Distributor.create(
      {
        mobileNumber: body.mobileNumber,
        name: body.name,
        distributorName: body.distributorName,
        email: body.email,
        gender: body.gender,
        dateOfBirth: body.dateOfBirth,
        district: body.district,
        state: body.state,
        bankName: body.bankName,
        accountNumber: body.accountNumber,
        ifscCode: body.ifscCode,
        accountName: body.accountName,
        aadhaarNumber: body.aadhaarNumber,
        panNumber: body.panNumber,
        aadhaarFrontImage,
        aadhaarBackImage,
        panCardImage,
        bankPassbookImage,
        password: body.password,
        distributorAddressLine1: body.distributorAddressLine1,
        distributorAddressLine2: body.distributorAddressLine2,
        postOffice: body.postOffice,
        pinCode: body.pinCode,
        branchName: body.branchName,
        onBoardedBy: body.onBoardedBy,
        onBoardedPersonId: body.onBoardedPersonId,
        onBoardedPersonName: body.onBoardedPersonName,
      },
      { transaction }
    );

    if (!newDistributor) {
      await transaction.rollback();
      return res
        .status(400)
        .json({ error: false, message: "Failed to create distributor" });
    }

    delete otpStorage[body.mobileNumber];
    await transaction.commit();

    return res.status(201).json({
      status: "Distributor Successfully registered",
    });
  } catch (error) {
    await transaction.rollback();
    console.log("error", error.message);
    return res.status(500).json({
      status: "error",
      message: "An error occurred while registering the distributor",
    });
  }
};

module.exports = {
  registerDistributor,
};
