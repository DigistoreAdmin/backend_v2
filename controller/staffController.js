const user = require("../db/models/user");
const catchAsync = require("../utils/catchAsync");
const sequelize = require("../config/database");
const defineStaffsDetails = require("../db/models/staffs");
const AppError = require("../utils/appError");

const createStaffs = catchAsync(async (req, res, next) => {
  const {
    userType,
    password,
    firstName,
    lastName,
    emailId,
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
    accountHolderName,
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
      where: { email: emailId },
      transaction,
    });

    if (mail) {
      await transaction.rollback();
      return res
        .status(400)
        .json({ success: false, message: "Email already exists" });
    }

    const data = await user.create(
      { userType, password, phoneNumber, email: emailId },
      { transaction }
    );

    if (!data) {
      await transaction.rollback();
      return res
        .status(400)
        .json({ success: false, message: "Failed to create user" });
    }

    const staffs = defineStaffsDetails(employmentType, isTrainingRequired);

    const employeeId = "";

    const newStaff = await staffs.create(
      {
        employeeId,
        userType,
        password: data.password,
        firstName,
        lastName,
        emailId,
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
        accountHolderName,
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
        other,
        phone,
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

    delete otpStorage[mobileNumber];
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
