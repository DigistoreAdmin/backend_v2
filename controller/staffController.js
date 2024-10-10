const user = require("../db/models/user");
const catchAsync = require("../utils/catchAsync");
const sequelize = require("../config/database");
const defineStaffsDetails = require("../db/models/staffs");
const AppError = require("../utils/appError");

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
    const numberExist = await user.findOne({
      where: { phoneNumber: phoneNumber },
      transaction,
    });

    if (numberExist) {
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
module.exports = {
  createStaffs,
};
