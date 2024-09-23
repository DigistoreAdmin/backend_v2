const sequelize = require("../config/database");
const Franchise = require("../db/models/franchise");
const staff = require("../db/models/staffs");
const defineStaffsDetails = require("../db/models/staffs");
const user = require("../db/models/user");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const { Op } = require("sequelize");

const getAllFranchises = catchAsync(async (req, res, next) => {
  const { sort, filter, search, page, pageLimit } = req.query;
  console.log(req.query);
  const order = sort ? [[sort, "DESC"]] : [];
  const where = {};
  if (filter) {
    const filters = JSON.parse(filter);
    if (filters.ownerName) {
      where.ownerName = filters.ownerName;
    }
    if (filters.franchiseName) {
      where.franchiseName = filters.franchiseName;
    }
    if (filters.userPlan) {
      where.userPlan = filters.userPlan;
    }
    if (filters.phoneNumber) {
      where.phoneNumber = filters.phoneNumber;
    }
    if (filters.panCenter) {
      where.panCenter = filters.panCenter;
    }
    if (filters.blocked) {
      where.blocked = filters.blocked;
    }
  }

  const phoneNumber = parseFloat(search);

  if (search) {
    where[Op.or] = [
      { ownerName: { [Op.iLike]: `%${search}%` } },
      { franchiseName: { [Op.iLike]: `%${search}%` } },
      //   { phoneNumber: { [Op.iLike]: `%${search}%` } },
    ];
    if (!isNaN(phoneNumber)) {
      where[Op.or].push({ phoneNumber: { [Op.eq]: phoneNumber } });
    }
  }

  if (!page || !pageLimit) {
    return res.status(400).json({ error: "page and pageSize are required" });
  }

  const pageNumber = parseInt(page, 10);
  const pageLimitNumber = parseInt(pageLimit, 10);

  const limit = pageLimitNumber;
  const offset = (pageNumber - 1) * limit;

  try {
    const data = await Franchise.findAndCountAll({
      where,
      order,
      limit,
      offset,
    });
    if (data.count === 0) {
      return res
        .status(404)
        .json({ succes: "false", message: "No data to display" });
    }
    data.rows.forEach((row) => {
      row.password = "";
    });
    if (data.rows.length === 0) {
      return res
        .status(404)
        .json({ succes: "false", message: "No data to display" });
    }

    return res.json({
      status: "success",
      data: data,
      totalItems: data.count,
      totalPages: Math.ceil(data.count / limit),
      currentPage: pageNumber,
    });
  } catch (error) {
    console.error("Error:", error);
    return next(new AppError(error.message, 500));
  }
});

const updateStaffDetails = catchAsync(async (req, res, next) => {
  try {
    const {
      userType,
      employeeId,
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

    const staffs = defineStaffsDetails();

    const findStaff = await staffs.findOne({
      where: { employeeId },
    });

    if (!findStaff) {
      return res
        .status(404)
        .json({ success: false, message: "Staff not found" });
    }

    const updatedStaff = await staffs.update(
      {
        userType,
        employeeId,
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
      },
      {
        where: { employeeId },
      }
    );

    if (!updatedStaff) {
      return res
        .status(400)
        .json({ success: false, message: "Failed to update staff" });
    }

    const updatedStaffs = await staffs.findOne({
      where: { employeeId },
    });

    return res
      .status(200)
      .json({ success: true, message: "Updated staff", staffs: updatedStaffs });
  } catch (error) {
    console.log("Error:", error);
    return next(new AppError(error.message, 500));
  }
});

const getAllStaff = catchAsync(async (req, res, next) => {
  const { sort, filter, search, page, pageLimit } = req.query;
  console.log(req.query);
  const order = sort ? [[sort, "DESC"]] : [];
  const where = {};
  if (filter) {
    const filters = JSON.parse(filter);
    if (filters.firstName) {
      where.firstName = filters.firstName;
    }
    if (filters.emailId) {
      where.emailId = filters.emailId;
    }
    if (filters.phoneNumber) {
      where.phoneNumber = filters.phoneNumber;
    }
  }
  console.log("where", where);
  const phoneNumber = parseFloat(search);

  if (search) {
    where[Op.or] = [
      { firstName: { [Op.iLike]: `%${search}%` } },
      { emailId: { [Op.iLike]: `%${search}%` } },
    ];
    if (!isNaN(phoneNumber)) {
      where[Op.or].push({ phoneNumber: { [Op.eq]: phoneNumber } });
    }
  }

  if (!page || !pageLimit) {
    return res.status(400).json({ error: "page and pageSize are required" });
  }

  const pageNumber = parseInt(page, 10);
  const pageLimitNumber = parseInt(pageLimit, 10);

  const limit = pageLimitNumber;
  const offset = (pageNumber - 1) * limit;

  const staffDetail = staff();
  try {
    const data = await staffDetail.findAndCountAll({
      where,
      order,
      limit,
      offset,
    });
    if (data.count === 0) {
      return res
        .status(404)
        .json({ succes: "false", message: "No Staff Details To Display" });
    }
    data.rows.forEach((row) => {
      row.password = "";
    });
    if (data.rows.length === 0) {
      return res
        .status(404)
        .json({ succes: "false", message: "No Staff Details To Display" });
    }

    return res.json({
      status: "success",
      data: data,
      totalItems: data.count,
      totalPages: Math.ceil(data.count / limit),
      currentPage: pageNumber,
    });
  } catch (error) {
    console.error("Error:", error);
    return next(new AppError(error.message, 500));
  }
});

module.exports = { getAllFranchises, updateStaffDetails, getAllStaff };

