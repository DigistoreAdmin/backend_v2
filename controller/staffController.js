const user = require("../db/models/user");
const catchAsync = require("../utils/catchAsync");
const sequelize = require("../config/database");
const defineStaffsDetails = require("../db/models/staffs");
const azureStorage = require("azure-storage");
const intoStream = require("into-stream");
const otpStorage = require("../utils/otpStorage");
const AppError = require("../utils/appError");

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

const createStaffs = catchAsync(async (req, res, next) => {
  const {
    password,
    firstName,
    lastName,
    email,
    phoneNumber,
    dateOfBirth,
    gender,
    addressLine1,
    addressLine2,
    city,
    district,
    state,
    pinCode,
    bank,
    accountNumber,
    ifscCode,
    accountName,
    branchName,
    dateOfJoin,
    bloodGroup,
    employment,
    employmentType,
    districtOfOperation,
    reportingManager,
    emergencyContact,
    isTrainingRequired,
    totalTrainingDays,
    employmentStartDate,
    laptop,
    idCard,
    sim,
    vistingCard,
    posterOrBroucher,
    other,
    phone,
    laptopDetails,
    phoneDetails,
    idCardDetails,
    vistingCardDetails,
    posterOrBroucherDetails,
    simDetails,
    otherDetails,
    remarks,
  } = req.body;

  const transaction = await sequelize.transaction();

  try {
    const mobileNumber = await user.findOne({
      where: { phoneNumber },
      transaction,
    });

    if (mobileNumber) {
      await transaction.rollback();
      return res
        .status(400)
        .json({ success: false, message: "Phone number already exists" });
    }

    const mail = await user.findOne({
      where: { email: email },
      transaction,
    });

    if (mail) {
      await transaction.rollback();
      return res
        .status(400)
        .json({ success: false, message: "Email already exists" });
    }

    const data = await user.create(
      { userType: "staff", password, phoneNumber, email },
      { transaction }
    );

    if (!data) {
      await transaction.rollback();
      return res
        .status(400)
        .json({ success: false, message: "Failed to create user" });
    }

    const staffs = defineStaffsDetails(
      employmentType,
      isTrainingRequired,
      laptop,
      idCard,
      vistingCard,
      posterOrBroucher,
      sim,
      other
    );

    const profilePicUrl = await uploadBlob(req.files.profilePic);

    const employeeId = "";

    const newStaff = await staffs.create(
      {
        userType: "staff",
        employeeId,
        password: data.password,
        firstName,
        lastName,
        email,
        phoneNumber,
        dateOfBirth,
        gender,
        addressLine1,
        addressLine2,
        city,
        district,
        state,
        pinCode,
        bank,
        accountNumber,
        branchName,
        ifscCode,
        accountName,
        dateOfJoin,
        emergencyContact,
        isTrainingRequired,
        totalTrainingDays,
        employmentStartDate,
        bloodGroup,
        employment,
        employmentType,
        districtOfOperation,
        reportingManager,
        laptop,
        idCard,
        vistingCard,
        posterOrBroucher,
        sim,
        phone,
        profilePic: profilePicUrl,
        other,
        laptopDetails,
        idCardDetails,
        vistingCardDetails,
        posterOrBroucherDetails,
        simDetails,
        phoneDetails,
        otherDetails,
        remarks,
      },
      { transaction }
    );

    if (!newStaff) {
      await transaction.rollback();
      return res
        .status(400)
        .json({ success: false, message: "Failed to create new staff" });
    }

    await transaction.commit();

    return res.status(201).json({
      message: "success",
      data: newStaff,
    });
  } catch (error) {
    await transaction.rollback();
    console.log("error", error.message);
    return res.status(500).json({
      success: false,
      message: "An error occurred while creating the staff",
    });
  }
});

const updateStaff = catchAsync(async (req, res, next) => {
  try {
    const {
      addressLine1,
        addressLine2,
        state,
        district,
        pinCode,
        city,
        ward,
    } = req.body;
    const user = req.user;

    const staffs = defineStaffsDetails();

    const staff =await  staffs.findOne({ where: { email: user.email } });
    console.log("email", user.email);
    // console.log("staff",staff)

    if (!staff) {
      return res
        .status(404)
        .json({ success: false, message: "Staff not found" });
    }

    const employeeId = staff.employeeId;
    console.log("employeeId: ", employeeId);

    const updatedStaff = await staffs.update(
      {
        addressLine1,
        addressLine2,
        state,
        district,
        pinCode,
        city,
        ward,      
      },
      {
        where: { employeeId: employeeId },
      }
    );
    if (!updatedStaff) {
      return res
        .status(400)
        .json({ success: false, message: "Failed to update staff" });
    }

    const updatedStaffs=await staffs.findOne({
      where: { employeeId: employeeId}
    })

    return res
      .status(200)
      .json({ success: true, message: "Updated staff",  updatedStaffs });
  } catch (error) {
    console.log("Error:", error);
    return next(new AppError(error.message, 500));
  }
});

module.exports = {
  createStaffs,
  updateStaff,
};
