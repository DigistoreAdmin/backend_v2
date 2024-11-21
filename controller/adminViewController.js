const sequelize = require("../config/database");
const Franchise = require("../db/models/franchise");
const staff = require("../db/models/staffs");
const defineStaffsDetails = require("../db/models/staffs");
const user = require("../db/models/user");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const { Op } = require("sequelize");
const crypto = require("crypto");
const wallets = require("../db/models/wallet");


const algorithm = "aes-192-cbc";
const secret = process.env.FRANCHISE_SECRET_KEY;
const key = crypto.scryptSync(secret, "salt", 24);

const decryptData = (encryptedData) => {
  try {
    if (!encryptedData || !encryptedData.includes(":")) {
      console.error("Invalid encrypted data format", encryptedData);
      return null;
    }

    const [ivHex, encryptedText] = encryptedData.split(":");
    const iv = Buffer.from(ivHex, "hex");
    const decipher = crypto.createDecipheriv(algorithm, key, iv);
    let decrypted = decipher.update(encryptedText, "hex", "utf8");
    decrypted += decipher.final("utf8");
    return decrypted;

  } catch (error) {
    console.error("Decryption error:", error);
    return null;
  }
};

const getAllFranchises = catchAsync(async (req, res, next) => {
  const { sort, filter, search, page, pageLimit, startDate, endDate } = req.query;
  const order = sort ? [[sort, "DESC"]] : [["createdAt", "DESC"]];
  const where = {};

  if (filter) {
    const filters = JSON.parse(filter);

    if (filters.ownerName) where.ownerName = filters.ownerName;
    if (filters.franchiseName) where.franchiseName = filters.franchiseName;
    if (filters.userPlan) where.userPlan = filters.userPlan;
    if (filters.phoneNumber) where.phoneNumber = filters.phoneNumber;
    if (filters.panCenter) where.panCenter = filters.panCenter;
    if (filters.blocked) where.blocked = filters.blocked;
    if (filters.verified) where.verified = filters.verified;
  }

  const phoneNumber = parseFloat(search);

  if (search) {
    where[Op.or] = [
      { ownerName: { [Op.iLike]: `%${search}%` } },
      { franchiseName: { [Op.iLike]: `%${search}%` } },
    ];
    if (!isNaN(phoneNumber)) {
      where[Op.or].push({ phoneNumber: { [Op.eq]: phoneNumber } });
    }
  }
  if (startDate && endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    where.createdAt = { [Op.between]: [start, end] };
  }
  if (!page || !pageLimit) {
    return res.status(400).json({ error: "page and pageLimit are required" });
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

    if (data.count === 0 || data.rows.length === 0) {
      return res
        .status(404)
        .json({ success: "false", message: "No data to display" });
    }

    // Decrypt sensitive fields
    data.rows.forEach((row) => {
      if (row.panNumber) row.panNumber = decryptData(row.panNumber);
      if (row.accountNumber) row.accountNumber = decryptData(row.accountNumber);
      if (row.aadhaarNumber) row.aadhaarNumber = decryptData(row.aadhaarNumber);
      row.password = "";
    });

    return res.json({
      status: "success",
      data: data.rows,
      totalItems: data.count,
      totalPages: Math.ceil(data.count / limit),
      currentPage: pageNumber,
    });
  } catch (error) {
    console.error("Error:", error);
    return next(new AppError(error.message, 500));
  }
});


const getFranchise = catchAsync(async (req, res) => {
  const { franchiseUniqueId } = req.query;

  // Fetch franchise data and wallet data concurrently
  const [Data, walletData] = await Promise.all([
    Franchise.findOne({ where: { franchiseUniqueId } }),
    wallets.findOne({ where: { uniqueId: franchiseUniqueId } }),
  ]);

  // Check if franchise data exists
  if (!Data || !walletData) {
    return res.status(404).json({
      success: "false",
      message: "No data to display",
    });
  }

  // Decrypt sensitive data if present
  if (Data.panNumber) Data.panNumber = decryptData(Data.panNumber);
  if (Data.accountNumber) Data.accountNumber = decryptData(Data.accountNumber);
  if (Data.aadhaarNumber) Data.aadhaarNumber = decryptData(Data.aadhaarNumber);

  // Clear the password for security
  Data.password = "";

  const franchiseDataWithBalance = {
    ...Data.toJSON(),
    walletBalance: walletData.balance,
  };
  return res
    .status(200)
    .json({ success: "success", data: franchiseDataWithBalance });

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
    if (filters.gender) {
      where.gender = filters.gender;
    }
    if (filters.employment) {
      where.employment = filters.employment;
    }
    if (filters.employmentType) {
      where.employmentType = filters.employmentType;
    }
    if (filters.district) {
      where.district = filters.district;
    }
    if (filters.bloodGroup) {
      where.bloodGroup = { [Op.iLike]: `${filters.bloodGroup.trim()}%` }; // Using Sequelize's iLike operator with wildcard
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

const getStaff = catchAsync(async (req, res) => {
  const { employeeId } = req.query;
  const staffDetail = staff();
  const Data = await staffDetail.findOne({ where: { employeeId } });

  if (!Data) {
    return res
      .status(404)
      .json({ succes: "false", message: "No data to display" });
  }
  Data.password = "";
  return res.status(200).json({ succes: "success", data: Data });
});

module.exports = {
  getAllFranchises,
  getFranchise,
  updateStaffDetails,
  getAllStaff,
  getStaff,
};
