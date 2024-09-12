const Distributor = require("../db/models/distributor");
const User = require("../db/models/user");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const { generateOTP, sendOTP } = require("../utils/otpUtils");
const otpStorage = require("../utils/otpStorage");
const sequelize = require("../config/database");
const Student = require("../db/models/student");
const { Op } = require("sequelize");

const registerStudent = async (req, res) => {
  const user = req.user;
  const body = req.body;
  const transaction = await sequelize.transaction();

  try {
    const userExists = await User.findOne({
      where: {
        [Op.or]: [{ phoneNumber: body.mobileNumber }, { email: body.email }],
      },
      transaction,
    });

    if (userExists) {
      await transaction.rollback();
      const message =
        userExists.phoneNumber === body.mobileNumber
          ? "Phone number already exists"
          : "Email already exists";
      return res.status(400).json({ success: false, message });
    }

    const data = await User.create(
      {
        userType: "student",
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

    console.log("body", req.body);
    const newStudent = await Student.create(
      {
        collegeName: body.collegeName,
        collegeId: body.collegeId,
        teamId: body.teamId,
        email: body.email,
        district: body.district,
        facultyName: body.facultyName,
        captainName: body.captainName,
        mobileNumber: body.mobileNumber,
        password: body.password,
        onBoardedBy: body.onBoardedBy,
        onBoardedPersonId: body.onBoardedPersonId,
        onBoardedPersonName: body.onBoardedPersonName,
      },
      { transaction }
    );

    if (!newStudent) {
      await transaction.rollback();
      return res
        .status(400)
        .json({ error: false, message: "Failed to create Student" });
    }

    delete otpStorage[body.mobileNumber];
    await transaction.commit();
    return res.status(201).json({ status: "Student Successfully registered" });
  } catch (error) {
    await transaction.rollback();
    console.log("error", error.message);
    return res.status(500).json({
      status: "error",
      message: "An error occurred while registering the student",
    });
  }
};

const countOfFranchise = async (req, res) => {
  const user = req.user;
  const body = req.body;
  const data = await Franchise.findAll({
    where: { onBoardedPersonId: body.id },
  });
  if (!data) {
    return next(new AppError("data not fetch", 401));
  }
  return res.status(201).json({
    message: "success",
    data: data,
  });
};

function generateRandomNumber() {
  const randomNumber =
    Math.floor(Math.random() * (999999999999 - 100000000000 + 1)) +
    100000000000;
  return randomNumber.toString();
}

module.exports = {
  registerStudent,
  countOfFranchise,
};
