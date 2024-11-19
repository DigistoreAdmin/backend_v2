const panCardUsers = require("../db/models/pancard");
const definePassportDetails = require("../db/models/passport");
const Franchise = require("../db/models/franchise");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const kswift = require("../db/models/kswift");
const defineStaffsDetails = require("../db/models/staffs");
const trainBooking = require("../db/models/trainbooking");
const udyamRegistrations = require("../db/models/udyamregistration");
const financialstatements = require("../db/models/financialstatements");
const companyFormations = require("../db/models/companyformation");
const BusBooking = require("../db/models/busbooking");
const fssaiRegistrations = require("../db/models/fssairegistration");
const fssaiLicences = require("../db/models/fssailicence");
const gstRegistrationDetails = require("../db/models/gstregistration");
const gstFilings = require("../db/models/gstfiling");
const incomeTaxFilingDetails = require("../db/models/incometax");
const partnerShipDeedTable = require("../db/models/partnershipdeedpreperation");
const packingLicence = require("../db/models/packinglicences");
const defineVehicleInsurance = require("../db/models/vehicleInsurance");
const loanAgainstProperty = require("../db/models/loanAgainstProperty");
const defineBusinessLoanUnscuredExisting = require("../db/models/BusinessLoanUnsecuredExisting");
const defineHousingLoan = require("../db/models/HousingLoan");
const defineBusinessLoanNewSecured = require("../db/models/businessLoanNewSecured");
const newVehicleLoan = require("../db/models/newvehicleloan");
const usedVehicleLoan = require("../db/models/vehicleloanused");
const definePersonalLoan = require("../db/models/personalloan");
const defineBusinessLoanUnsecuredNew = require("../db/models/businessloanunsecurednew");
const businessLoanExistingDetails = require("../db/models/businessloanexisting")
const microLoans = require("../db/models/microloan");
const medicalInsuranceData = require("../db/models/medicalinsurance");
const microLoanShop = require("../db/models/microloansshop");
const crypto = require("crypto");

const algorithm = "aes-192-cbc";
const secret = process.env.INCOMETAX_SECRET_KEY;
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

const getPancardDetails = async (req, res) => {
  try {
    const { sort, page, pageLimit, pantype, isDuplicateOrChange } = req.query;

    console.log("req.query", req.query);

    if (!page || !pageLimit) {
      return res
        .status(400)
        .json({ error: "page and pageLimit query parameters are required" });
    }

    const pageNumber = parseInt(page, 10);
    const pageLimitNumber = parseInt(pageLimit, 10);

    const limit = pageLimitNumber;
    const offset = (pageNumber - 1) * limit;

    let where = {};

    if (pantype === "duplicateOrChangePancard") {
      where = { panType: pantype };
      if (isDuplicateOrChange) {
        where = {
          panType: pantype,
          isDuplicateOrChangePan: isDuplicateOrChange,
        };
      }
    } else if (pantype) {
      where = { panType: pantype };
    }

    const PancardUser = panCardUsers();

    const data = await PancardUser.findAndCountAll({
      where: where,
      limit,
      offset,
      order: sort ? [[sort, "ASC"]] : undefined,
    });
    if (data.rows.length === 0) {
      return res.status(404).json({ message: "Page not found" });
    }

    return res.status(200).json({
      data: data.rows,
      totalItems: data.count,
      totalPages: Math.ceil(data.count / limit),
      currentPage: pageNumber,
    });
  } catch (error) {
    console.error("Error fetching pancard details:", error);
    res.status(500).json({ error: "Failed to fetch pancard details" });
  }
};

const fetchPassport = catchAsync(async (req, res, next) => {
  const { page, pageLimit } = req.query;

  if (!page || !pageLimit) {
    return res
      .status(400)
      .json({ error: "page and pageSize query parameters are required" });
  }

  const pageNumber = parseInt(page, 10);
  const pageLimitNumber = parseInt(pageLimit, 10);

  const limit = pageLimitNumber;
  const offset = (pageNumber - 1) * limit;

  const Passport = await definePassportDetails();
  const getPassport = await Passport.findAndCountAll({
    limit,
    offset,
  });
  if (!getPassport) {
    return next(new AppError("Data not found", 404));
  }

  res.status(200).json({
    data: getPassport.rows,
    totalPages: Math.ceil(getPassport.count / limit),
    totalItems: getPassport.count,
    currentPage: pageNumber,
  });
});

const fetchKswift = catchAsync(async (req, res, next) => {
  const { page, pageLimit } = req.query;

  if (!page || !pageLimit) {
    return res
      .status(400)
      .json({ error: "page and pageSize query parameters are required" });
  }

  const pageNumber = parseInt(page, 10);
  const pageLimitNumber = parseInt(pageLimit, 10);

  const limit = pageLimitNumber;
  const offset = (pageNumber - 1) * limit;

  const getKswift = await kswift.findAndCountAll({
    limit,
    offset,
  });
  if (!getKswift) {
    return next(new AppError("Data not found", 404));
  }

  res.status(200).json({
    data: getKswift.rows,
    totalPages: Math.ceil(getKswift.count / limit),
    totalItems: getKswift.count,
    currentPage: pageNumber,
  });
});

const getBusBookings = catchAsync(async (req, res, next) => {
  const { page, pageLimit } = req.query;

  if (!page || !pageLimit) {
    return res
      .status(400)
      .json({ error: "page and pageLimit query parameters are required" });
  }

  const pageNumber = parseInt(page, 10);
  const pageLimitNumber = parseInt(pageLimit, 10);

  const limit = pageLimitNumber;
  const offset = (pageNumber - 1) * limit;

  const busBookings = await BusBooking.findAndCountAll({
    limit,
    offset,
  });
  if (!busBookings) {
    return next(new AppError("Data not found", 404));
  }
  res.status(200).json({
    data: busBookings.rows,
    totalPages: Math.ceil(busBookings.count / limit),
    totalItems: busBookings.count,
    currentPage: pageNumber,
  });
});

const getFssaiRegistrations = catchAsync(async (req, res, next) => {
  const { page, pageLimit } = req.query;

  if (!page || !pageLimit) {
    return res
      .status(400)
      .json({ error: "page and pageLimit query parameters are required" });
  }

  const pageNumber = parseInt(page, 10);
  const pageLimitNumber = parseInt(pageLimit, 10);

  const limit = pageLimitNumber;
  const offset = (pageNumber - 1) * limit;

  const fssaiRegistration = await fssaiRegistrations.findAndCountAll({
    limit,
    offset,
  });
  if (!fssaiRegistration) {
    return next(new AppError("Data not found", 404));
  }
  res.status(200).json({
    data: fssaiRegistration.rows,
    totalPages: Math.ceil(fssaiRegistration.count / limit),
    totalItems: fssaiRegistration.count,
    currentPage: pageNumber,
  });
});

const getFssaiLicence = catchAsync(async (req, res, next) => {
  const { page, pageLimit } = req.query;

  if (!page || !pageLimit) {
    return res
      .status(400)
      .json({ error: "page and pageLimit query parameters are required" });
  }

  const pageNumber = parseInt(page, 10);
  const pageLimitNumber = parseInt(pageLimit, 10);

  const limit = pageLimitNumber;
  const offset = (pageNumber - 1) * limit;

  const fssaiLicenceDetails = await fssaiLicences.findAndCountAll({
    limit,
    offset,
  });
  if (!fssaiLicenceDetails) {
    return next(new AppError("Data not found", 404));
  }
  res.status(200).json({
    data: fssaiLicenceDetails.rows,
    totalPages: Math.ceil(fssaiLicenceDetails.count / limit),
    totalItems: fssaiLicenceDetails.count,
    currentPage: pageNumber,
  });
});

const fetchTrainBookingDetails = catchAsync(async (req, res) => {
  try {
    const { page, pageLimit } = req.query;

    if (!page || !pageLimit) {
      return res.status(400).json({ error: "page and pageSize are required" });
    }

    const pageNumber = parseInt(page, 10);
    const pageLimitNumber = parseInt(pageLimit, 10);

    const limit = pageLimitNumber;
    const offset = (pageNumber - 1) * limit;

    const Data = await trainBooking.findAndCountAll({ limit, offset });

    if (Data.count === 0) {
      return res
        .status(404)
        .json({ succes: "false", message: "No data to display" });
    }

    if (Data.rows.length === 0) {
      return res
        .status(404)
        .json({ succes: "false", message: "No data to display" });
    }

    return res.json({
      status: "success",
      data: Data,
      totalItems: Data.count,
      totalPages: Math.ceil(Data.count / limit),
      currentPage: pageNumber,
    });
  } catch (error) {
    console.error("Error:", error);
    return next(new AppError(error.message, 500));
  }
});

const fetchUdyamRegistrationDetails = catchAsync(async (req, res) => {
  try {
    const { page, pageLimit } = req.query;

    if (!page || !pageLimit) {
      return res.status(400).json({ error: "page and pageSize are required" });
    }

    const pageNumber = parseInt(page, 10);
    const pageLimitNumber = parseInt(pageLimit, 10);

    const limit = pageLimitNumber;
    const offset = (pageNumber - 1) * limit;

    const Data = await udyamRegistrations.findAndCountAll({ limit, offset });

    if (Data.count === 0) {
      return res
        .status(404)
        .json({ succes: "false", message: "No data to display" });
    }

    if (Data.rows.length === 0) {
      return res
        .status(404)
        .json({ succes: "false", message: "No data to display" });
    }

    return res.json({
      status: "success",
      data: Data,
      totalItems: Data.count,
      totalPages: Math.ceil(Data.count / limit),
      currentPage: pageNumber,
    });
  } catch (error) {
    console.error("Error:", error);
    return next(new AppError(error.message, 500));
  }
});

const fetchFinancialStatements = catchAsync(async (req, res) => {
  try {
    const { page, pageLimit } = req.query;

    if (!page || !pageLimit) {
      return res.status(400).json({ error: "page and pageSize are required" });
    }

    const pageNumber = parseInt(page, 10);
    const pageLimitNumber = parseInt(pageLimit, 10);

    const limit = pageLimitNumber;
    const offset = (pageNumber - 1) * limit;

    const Data = await financialstatements.findAndCountAll({ limit, offset });

    if (Data.count === 0) {
      return res
        .status(404)
        .json({ succes: "false", message: "No data to display" });
    }

    if (Data.rows.length === 0) {
      return res
        .status(404)
        .json({ succes: "false", message: "No data to display" });
    }

    return res.json({
      status: "success",
      data: Data,
      totalItems: Data.count,
      totalPages: Math.ceil(Data.count / limit),
      currentPage: pageNumber,
    });
  } catch (error) {
    console.error("Error:", error);
    return next(new AppError(error.message, 500));
  }
});

const fetchCompanyFormationDetails = catchAsync(async (req, res) => {
  try {
    const { page, pageLimit } = req.query;

    if (!page || !pageLimit) {
      return res.status(400).json({ error: "page and pageSize are required" });
    }

    const pageNumber = parseInt(page, 10);
    const pageLimitNumber = parseInt(pageLimit, 10);

    const limit = pageLimitNumber;
    const offset = (pageNumber - 1) * limit;

    const Data = await companyFormations.findAndCountAll({ limit, offset });

    if (Data.count === 0) {
      return res
        .status(404)
        .json({ succes: "false", message: "No data to display" });
    }

    if (Data.rows.length === 0) {
      return res
        .status(404)
        .json({ succes: "false", message: "No data to display" });
    }

    return res.json({
      status: "success",
      data: Data,
      totalItems: Data.count,
      totalPages: Math.ceil(Data.count / limit),
      currentPage: pageNumber,
    });
  } catch (error) {
    console.error("Error:", error);
    return next(new AppError(error.message, 500));
  }
});

const getGstRegistrations = catchAsync(async (req, res, next) => {
  const { page, pageLimit } = req.query;

  if (!page || !pageLimit) {
    return res
      .status(400)
      .json({ error: "page and pageLimit query parameters are required" });
  }

  const pageNumber = parseInt(page, 10);
  const pageLimitNumber = parseInt(pageLimit, 10);

  const limit = pageLimitNumber;
  const offset = (pageNumber - 1) * limit;

  const gstRegistrationTable = await gstRegistrationDetails();
  const gstRegistrations = await gstRegistrationTable.findAndCountAll({
    limit,
    offset,
  });
  if (!gstRegistrations) {
    return next(new AppError("Data not found", 404));
  }
  res.status(200).json({
    data: gstRegistrations.rows,
    totalPages: Math.ceil(gstRegistrations.count / limit),
    totalItems: gstRegistrations.count,
    currentPage: pageNumber,
  });
});

const getGstFilings = catchAsync(async (req, res, next) => {
  const { page, pageLimit } = req.query;

  if (!page || !pageLimit) {
    return res
      .status(400)
      .json({ error: "page and pageLimit query parameters are required" });
  }

  const pageNumber = parseInt(page, 10);
  const pageLimitNumber = parseInt(pageLimit, 10);

  const limit = pageLimitNumber;
  const offset = (pageNumber - 1) * limit;
  const gstFilingDetails = await gstFilings.findAndCountAll({
    limit,
    offset,
  });
  if (!gstFilingDetails) {
    return next(new AppError("Data not found", 404));
  }
  res.status(200).json({
    data: gstFilingDetails.rows,
    totalPages: Math.ceil(gstFilingDetails.count / limit),
    totalItems: gstFilingDetails.count,
    currentPage: pageNumber,
  });
});

const getIncomeTaxFilings = catchAsync(async (req, res, next) => {
  let { page = 1, pageLimit = 10 } = req.query;
  const pageNumber = parseInt(page, 10);
  const pageLimitNumber = parseInt(pageLimit, 10);

  if (
    isNaN(pageNumber) ||
    pageNumber <= 0 ||
    isNaN(pageLimitNumber) ||
    pageLimitNumber <= 0
  ) {
    return res.status(400).json({
      status: "fail",
      message: "page and pageLimit query parameters must be positive numbers",
    });
  }

  const limit = pageLimitNumber;
  const offset = (pageNumber - 1) * limit;

  const incomeTaxTable = incomeTaxFilingDetails();
  const incomeTaxFilingDetail = await incomeTaxTable.findAndCountAll({
    limit,
    offset,
  });

  if (!incomeTaxFilingDetail || incomeTaxFilingDetail.rows.length === 0) {
    return next(new AppError("No income tax filings found", 404));
  }

  incomeTaxFilingDetail.rows.forEach((row) => {
    if (row.incomeTaxPassword)
      row.incomeTaxPassword = decryptData(row.incomeTaxPassword);
    if (row.panNumber) row.panNumber = decryptData(row.panNumber);
    if (row.gstPassword) row.gstPassword = decryptData(row.gstPassword);
  });
  const totalPages = Math.ceil(incomeTaxFilingDetail.count / limit);

  res.status(200).json({
    status: "success",
    currentPage: pageNumber,
    totalPages,
    totalItems: incomeTaxFilingDetail.count,
    results: incomeTaxFilingDetail.rows.length,
    data: incomeTaxFilingDetail.rows,
  });
});

const getPartnerShipDeedPreparation = catchAsync(async (req, res, next) => {
  let { page = 1, pageLimit = 10 } = req.query;
  const pageNumber = parseInt(page, 10);
  const pageLimitNumber = parseInt(pageLimit, 10);

  if (
    isNaN(pageNumber) ||
    pageNumber <= 0 ||
    isNaN(pageLimitNumber) ||
    pageLimitNumber <= 0
  ) {
    return res.status(400).json({
      status: "fail",
      message: "page and pageLimit query parameters must be positive numbers",
    });
  }

  const limit = pageLimitNumber;
  const offset = (pageNumber - 1) * limit;

  const partnershipDeedPreparations =
    await partnerShipDeedTable.findAndCountAll({
      limit,
      offset,
    });

  if (
    !partnershipDeedPreparations ||
    partnershipDeedPreparations.rows.length === 0
  ) {
    return next(new AppError("No partnership deed preparations found", 404));
  }

  const totalPages = Math.ceil(partnershipDeedPreparations.count / limit);

  res.status(200).json({
    status: "success",
    currentPage: pageNumber,
    totalPages,
    totalItems: partnershipDeedPreparations.count,
    results: partnershipDeedPreparations.rows.length,
    data: partnershipDeedPreparations.rows,
  });
});

const getPackingLicences = catchAsync(async (req, res, next) => {
  let { page = 1, pageLimit = 10 } = req.query;

  const pageNumber = parseInt(page, 10);
  const pageLimitNumber = parseInt(pageLimit, 10);

  if (
    isNaN(pageNumber) ||
    pageNumber <= 0 ||
    isNaN(pageLimitNumber) ||
    pageLimitNumber <= 0
  ) {
    return res.status(400).json({
      status: "fail",
      message: "page and pageLimit query parameters must be positive numbers",
    });
  }

  const limit = pageLimitNumber;
  const offset = (pageNumber - 1) * limit;

  const packingLicenceDetails = await packingLicence.findAndCountAll({
    limit,
    offset,
  });

  if (!packingLicenceDetails || packingLicenceDetails.rows.length === 0) {
    return next(new AppError("No packing licences found", 404));
  }

  const totalPages = Math.ceil(packingLicenceDetails.count / limit);

  res.status(200).json({
    status: "success",
    currentPage: pageNumber,
    totalPages,
    totalItems: packingLicenceDetails.count,
    results: packingLicenceDetails.rows.length,
    data: packingLicenceDetails.rows,
  });
});

const getVehicleInsurance = catchAsync(async (req, res, next) => {
  try {
    const { page, pageLimit } = req.query;

    if (!page || !pageLimit) {
      return res
        .status(400)
        .json({ error: "page and pageLimit query parameters are required" });
    }

    const pageNumber = parseInt(page, 10);
    const pageLimitNumber = parseInt(pageLimit, 10);

    const limit = pageLimitNumber;
    const offset = (pageNumber - 1) * limit;

    const vehicleInsurance = await defineVehicleInsurance();
    const getInsurance = await vehicleInsurance.findAndCountAll({
      limit,
      offset,
    });

    if (!getInsurance) {
      return next(new AppError("Data not found", 404));
    }

    res.status(200).json({
      data: getInsurance.rows,
      totalPages: Math.ceil(getInsurance.count / limit),
      totalItems: getInsurance.count,
      currentPage: pageNumber,
      currentPage: pageNumber,
    });
  } catch (error) {
    console.error("Error:", error);
    return next(new AppError(error.message, 500));
  }
});

const getAllWorks = catchAsync(async (req, res, next) => {
  try {
    const { page, pageLimit, search, sortBy, sortOrder, filter } = req.query;

    if (!page || !pageLimit) {
      return res.status(400).json({
        error: "page and pageLimit query parameters are required",
      });
    }

    const pageNumber = parseInt(page, 10);
    const pageLimitNumber = parseInt(pageLimit, 10);

    const limit = pageLimitNumber;
    const offset = (pageNumber - 1) * limit;

    const [
      pancardDetails,
      passportDetails,
      kSwiftDetails,
      busBookingsDetails,
      fssaiRegistrationDetails,
      fssaiLicenceDetails,
      trainBookingDetails,
      udyamRegistrationDetails,
      financialstatementDetails,
      companyFormationDetails,
      gstRegistrationsDetails,
      gstFilingDetails,
      incomeTaxFilingsDetails,
      partnershipDeedPreparations,
      packingLicenceDetails,
      vehicleInsuranceDetails,
      franchises,
    ] = await Promise.all([
      panCardUsers().findAndCountAll(),
      definePassportDetails().findAndCountAll(),
      kswift.findAndCountAll(),
      BusBooking.findAndCountAll(),
      fssaiRegistrations.findAndCountAll(),
      fssaiLicences.findAndCountAll(),
      trainBooking().findAndCountAll(),
      udyamRegistrations.findAndCountAll(),
      financialstatements.findAndCountAll(),
      companyFormations.findAndCountAll(),
      gstRegistrationDetails().findAndCountAll(),
      gstFilings.findAndCountAll(),
      incomeTaxFilingDetails().findAndCountAll(),
      partnerShipDeedTable.findAndCountAll(),
      packingLicence.findAndCountAll(),
      defineVehicleInsurance().findAndCountAll(),
      Franchise.findAll(),
    ]);

    const franchiseMap = franchises.reduce((map, franchise) => {
      map[franchise.franchiseUniqueId] = franchise.franchiseName;
      return map;
    }, {});

    let combinedData = [
      ...pancardDetails.rows.map((item) => ({
        ...item.dataValues,
        tableName: "Pan Card",
        franchiseName: franchiseMap[item.uniqueId],
      })),
      ...passportDetails.rows.map((item) => ({
        ...item.dataValues,
        tableName: "Passport",
        franchiseName: franchiseMap[item.uniqueId],
      })),
      ...kSwiftDetails.rows.map((item) => ({
        ...item.dataValues,
        tableName: "K-Swift",
        franchiseName: franchiseMap[item.uniqueId],
      })),
      ...busBookingsDetails.rows.map((item) => ({
        ...item.dataValues,
        tableName: "Bus Booking",
        franchiseName: franchiseMap[item.uniqueId],
      })),
      ...fssaiRegistrationDetails.rows.map((item) => ({
        ...item.dataValues,
        tableName: "FSSAI Registration",
        franchiseName: franchiseMap[item.uniqueId],
      })),
      ...fssaiLicenceDetails.rows.map((item) => ({
        ...item.dataValues,
        tableName: "FSSAI Licence",
        franchiseName: franchiseMap[item.uniqueId],
      })),
      ...trainBookingDetails.rows.map((item) => ({
        ...item.dataValues,
        tableName: "Train Booking",
        franchiseName: franchiseMap[item.uniqueId],
      })),
      ...udyamRegistrationDetails.rows.map((item) => ({
        ...item.dataValues,
        tableName: "Udyam Registration",
        franchiseName: franchiseMap[item.uniqueId],
      })),
      ...financialstatementDetails.rows.map((item) => ({
        ...item.dataValues,
        tableName: "Financial Statement",
        franchiseName: franchiseMap[item.uniqueId],
      })),
      ...companyFormationDetails.rows.map((item) => ({
        ...item.dataValues,
        tableName: "Company Formation",
        franchiseName: franchiseMap[item.uniqueId],
      })),
      ...gstRegistrationsDetails.rows.map((item) => ({
        ...item.dataValues,
        tableName: "GST Registration",
        franchiseName: franchiseMap[item.uniqueId],
      })),
      ...gstFilingDetails.rows.map((item) => ({
        ...item.dataValues,
        tableName: "GST Filing",
        franchiseName: franchiseMap[item.uniqueId],
      })),
      ...incomeTaxFilingsDetails.rows.map((item) => ({
        ...item.dataValues,
        tableName: "IncomeTax Filing",
        franchiseName: franchiseMap[item.uniqueId],
      })),
      ...partnershipDeedPreparations.rows.map((item) => ({
        ...item.dataValues,
        tableName: "Partnership Deed",
        franchiseName: franchiseMap[item.uniqueId],
      })),
      ...packingLicenceDetails.rows.map((item) => ({
        ...item.dataValues,
        tableName: "Packing Licence",
        franchiseName: franchiseMap[item.uniqueId],
      })),
      ...vehicleInsuranceDetails.rows.map((item) => ({
        ...item.dataValues,
        tableName: "Vehicle Insurance",
        franchiseName: franchiseMap[item.uniqueId],
      })),
    ];

    if (filter) {
      const filterObj = JSON.parse(filter);
      console.table(filterObj);

      Object.keys(filterObj).forEach((key) => {
        const filterValue = filterObj[key];
        if (Array.isArray(filterValue)) {
          if (filterValue.length != 0) {
            console.log("filterValue: ", filterValue);
            if (Array.isArray(filterValue)) {
              combinedData = combinedData.filter((item) =>
                filterValue.includes(String(item[key]))
              );
            } else {
              combinedData = combinedData.filter(
                (item) => String(item[key]) === String(filterValue)
              );
            }
          }
        }
      });
    }

    if (search) {
      combinedData = combinedData.filter((item) =>
        Object.values(item).some((value) =>
          String(value).toLowerCase().includes(search.toLowerCase())
        )
      );
    }

    combinedData.sort((a, b) => {
      const sortField = sortBy || "updatedAt";
      const sortDirection = sortOrder === "asc" ? 1 : -1;

      if (a[sortField] < b[sortField]) return -1 * sortDirection;
      if (a[sortField] > b[sortField]) return 1 * sortDirection;
      return 0;
    });

    const totalItems = combinedData.length;
    const paginatedData = combinedData.slice(offset, offset + limit);
    const totalPages = Math.ceil(totalItems / limit);

    if (totalItems === 0) {
      return res.status(404).json({
        status: "fail",
        message: "No data found",
      });
    }

    res.status(200).json({
      status: "success",
      currentPage: pageNumber,
      totalPages,
      totalItems,
      data: paginatedData,
    });
  } catch (error) {
    console.error("Error:", error);
    return next(new AppError(error.message, 500));
  }
});


const getAllWorksByStaffId=catchAsync(async (req, res, next) => {
  try {
    let { page, pageLimit, search, sortBy, sortOrder, filter,assignedId } = req.query;

    if(!assignedId){
      return res.status(400).json({
        error: "Please provide Assigned Id",
      });
    }

    if (!page || !pageLimit) {
      return res.status(400).json({
        error: "page and pageLimit query parameters are required",
      });
    }

    const pageNumber = parseInt(page, 10);
    const pageLimitNumber = parseInt(pageLimit, 10);

    const limit = pageLimitNumber;
    const offset = (pageNumber - 1) * limit;

    const [
      pancardDetails,
      passportDetails,
      kSwiftDetails,
      busBookingsDetails,
      fssaiRegistrationDetails,
      fssaiLicenceDetails,
      trainBookingDetails,
      udyamRegistrationDetails,
      financialstatementDetails,
      companyFormationDetails,
      gstRegistrationsDetails,
      gstFilingDetails,
      incomeTaxFilingsDetails,
      partnershipDeedPreparations,
      packingLicenceDetails,
      vehicleInsuranceDetails,
      franchises
    ] = await Promise.all([
      panCardUsers().findAndCountAll(),
      definePassportDetails().findAndCountAll(),
      kswift.findAndCountAll(),
      BusBooking.findAndCountAll(),
      fssaiRegistrations.findAndCountAll(),
      fssaiLicences.findAndCountAll(),
      trainBooking().findAndCountAll(),
      udyamRegistrations.findAndCountAll(),
      financialstatements.findAndCountAll(),
      companyFormations.findAndCountAll(),
      gstRegistrationDetails().findAndCountAll(),
      gstFilings.findAndCountAll(),
      incomeTaxFilingDetails().findAndCountAll(),
      partnerShipDeedTable.findAndCountAll(),
      packingLicence.findAndCountAll(),
      defineVehicleInsurance().findAndCountAll(),
      Franchise.findAll(),
    ]);

    const franchiseMap = franchises.reduce((map, franchise) => {
      map[franchise.franchiseUniqueId] = franchise.franchiseName;
      return map;
    }, {});

    let combinedData = [
      ...pancardDetails.rows.map(item => ({
        ...item.dataValues,
        tableName: 'Pan Card',
        franchiseName: franchiseMap[item.uniqueId],
      })),
      ...passportDetails.rows.map(item => ({
        ...item.dataValues,
        tableName: 'Passport',
        franchiseName: franchiseMap[item.uniqueId],
      })),
      ...kSwiftDetails.rows.map(item => ({
        ...item.dataValues,
        tableName: 'K-Swift',
        franchiseName: franchiseMap[item.uniqueId],
      })),
      ...busBookingsDetails.rows.map(item => ({
        ...item.dataValues,
        tableName: 'Bus Booking',
        franchiseName: franchiseMap[item.uniqueId],
      })),
      ...fssaiRegistrationDetails.rows.map(item => ({
        ...item.dataValues,
        tableName: 'FSSAI Registration',
        franchiseName: franchiseMap[item.uniqueId],
      })),
      ...fssaiLicenceDetails.rows.map(item => ({
        ...item.dataValues,
        tableName: 'FSSAI Licence',
        franchiseName: franchiseMap[item.uniqueId],
      })),
      ...trainBookingDetails.rows.map(item => ({
        ...item.dataValues,
        tableName: 'Train Booking',
        franchiseName: franchiseMap[item.uniqueId],
      })),
      ...udyamRegistrationDetails.rows.map(item => ({
        ...item.dataValues,
        tableName: 'Udyam Registration',
        franchiseName: franchiseMap[item.uniqueId],
      })),
      ...financialstatementDetails.rows.map(item => ({
        ...item.dataValues,
        tableName: 'Financial Statement',
        franchiseName: franchiseMap[item.uniqueId],
      })),
      ...companyFormationDetails.rows.map(item => ({
        ...item.dataValues,
        tableName: 'Company Formation',
        franchiseName: franchiseMap[item.uniqueId],
      })),
      ...gstRegistrationsDetails.rows.map(item => ({
        ...item.dataValues,
        tableName: 'GST Registration',
        franchiseName: franchiseMap[item.uniqueId],
      })),
      ...gstFilingDetails.rows.map(item => ({
        ...item.dataValues,
        tableName: 'GST Filing',
        franchiseName: franchiseMap[item.uniqueId],
      })),
      ...incomeTaxFilingsDetails.rows.map(item => ({
        ...item.dataValues,
        tableName: 'IncomeTax Filing',
        franchiseName: franchiseMap[item.uniqueId],
      })),
      ...partnershipDeedPreparations.rows.map(item => ({
        ...item.dataValues,
        tableName: 'Partnership Deed',
        franchiseName: franchiseMap[item.uniqueId],
      })),
      ...packingLicenceDetails.rows.map(item => ({
        ...item.dataValues,
        tableName: 'Packing Licence',
        franchiseName: franchiseMap[item.uniqueId],
      })),
      ...vehicleInsuranceDetails.rows.map(item => ({
        ...item.dataValues,
        tableName: 'Vehicle Insurance',
        franchiseName: franchiseMap[item.uniqueId],
      })),
    ];
  
     filter = filter ? (typeof filter === 'string' ? JSON.parse(filter) : filter) : {};
    
     filter.assignedId = assignedId;
 
     console.log("Updated filter:", filter);
     
     Object.keys(filter).forEach(key => {
       const filterValue = filter[key];
       if (Array.isArray(filterValue)) {
         if (filterValue.length !== 0) {
           console.log('filterValue: ', filterValue);
           combinedData = combinedData.filter(item => filterValue.includes(String(item[key])));
         }
       } else {
         combinedData = combinedData.filter(item => String(item[key]) === String(filterValue));
       }
     });

    if (search) {
      combinedData = combinedData.filter(item =>
        Object.values(item).some(value =>
          String(value).toLowerCase().includes(search.toLowerCase())
        )
      );
    }

    combinedData.sort((a, b) => {
      const sortField = sortBy || 'updatedAt';
      const sortDirection = sortOrder === 'asc' ? 1 : -1;

      if (a[sortField] < b[sortField]) return -1 * sortDirection;
      if (a[sortField] > b[sortField]) return 1 * sortDirection;
      return 0;
    });

    const totalItems = combinedData.length;
    const paginatedData = combinedData.slice(offset, offset + limit);
    const totalPages = Math.ceil(totalItems / limit);

    if (totalItems === 0) {
      return res.status(404).json({
        status: "fail",
        message: "No data found",
      });
    }

    res.status(200).json({
      status: "success",
      currentPage: pageNumber,
      totalPages,
      totalItems,
      data: paginatedData,
    });
  } catch (error) {
    console.error("Error:", error);
    return next(new AppError(error.message, 500));
  }
})

const getAllWorksByFranchise = catchAsync(async (req, res, next) => {
  try {
    const { page, pageLimit, search, sortBy, sortOrder, filter } = req.query;
    const user = req.user;

    if (!page || !pageLimit) {
      return res.status(400).json({ error: "page and pageLimit query parameters are required" });
    }

    const franchise = await Franchise.findOne({ where: { email: user.email } });
    if (!franchise) {
      return res.status(404).json({ status: 'fail', message: 'Franchise not found' });
    }

    const uniqueId = franchise.franchiseUniqueId;
    const pageNumber = parseInt(page, 10);
    const pageLimitNumber = parseInt(pageLimit, 10);
    const limit = pageLimitNumber;
    const offset = (pageNumber - 1) * limit;

    const detailsPromises = [
      { model: panCardUsers(), tableName: "Pan Card" },
      { model: definePassportDetails(), tableName: "Passport Details" },
      { model: kswift, tableName: "Kswift" },
      { model: BusBooking, tableName: "Bus Booking" },
      { model: fssaiRegistrations, tableName: "FSSAI Registrations" },
      { model: fssaiLicences, tableName: "FSSAI Licences" },
      { model: trainBooking(), tableName: "Train Booking" },
      { model: udyamRegistrations, tableName: "Udyam Registrations" },
      { model: financialstatements, tableName: "Financial Statements" },
      { model: companyFormations, tableName: "Company Formations" },
      { model: gstRegistrationDetails(), tableName: "GST Registration" },
      { model: gstFilings, tableName: "GST Filings" },
      { model: incomeTaxFilingDetails(), tableName: "Income Tax Filing" },
      { model: partnerShipDeedTable, tableName: "Partnership Deed" },
      { model: packingLicence, tableName: "Packing Licence" },
      { model: defineVehicleInsurance(), tableName: "Vehicle Insurance" },
      { model: loanAgainstProperty(), tableName: "Loan Against Property" },
      { model: defineBusinessLoanUnscuredExisting(), tableName: "Business Loan Unsecured Existing" },
      { model: defineHousingLoan(), tableName: "Housing Loan" },
      { model: defineBusinessLoanNewSecured(), tableName: "Business Loan New Secured" },
      { model: newVehicleLoan(), tableName: "New Vehicle Loan" },
      { model: usedVehicleLoan(), tableName: "Used Vehicle Loan" },
      { model: definePersonalLoan(), tableName: "Personal Loan" },
      { model: defineBusinessLoanUnsecuredNew(), tableName: "Business Loan Unsecured New" },
      { model: businessLoanExistingDetails(), tableName: "Business Loan Existing" },
      { model: microLoans, tableName: "Micro Loans" },
      { model: medicalInsuranceData(), tableName: "Medical Insurance" },
      { model: microLoanShop, tableName: "Micro Loan Shop" }
    ].map(({ model, tableName }) =>
      model.findAndCountAll({ where: { uniqueId } }).then((result) =>
        result.rows.map((item) => ({ ...item.dataValues, tableName }))
      )
    );

    const results = await Promise.all(detailsPromises);
    let combinedData = results.flat();

    if (filter) {
      const filterObj = JSON.parse(filter);
      Object.keys(filterObj).forEach((key) => {
        const filterValue = filterObj[key];
        if (Array.isArray(filterValue) && filterValue.length) {
          combinedData = combinedData.filter((item) => filterValue.includes(String(item[key])));
        }
      });
    }

    if (search) {
      combinedData = combinedData.filter((item) =>
        Object.values(item).some((value) => String(value).toLowerCase().includes(search.toLowerCase()))
      );
    }

    combinedData.sort((a, b) => {
      const sortField = sortBy || 'updatedAt';
      const direction = sortOrder === "asc" ? 1 : -1;
      if (a[sortField] < b[sortField]) return -1 * direction;
      if (a[sortField] > b[sortField]) return 1 * direction;
      return 0;
    });

    const totalItems = combinedData.length;
    const totalPages = Math.ceil(totalItems / limit);
    const paginatedData = combinedData.slice(offset, offset + limit);

    if (totalItems === 0) {
      return res.status(404).json({ status: "fail", message: "No data found" });
    }

    res.status(200).json({
      status: "success",
      currentPage: pageNumber,
      totalPages,
      totalItems,
      data: paginatedData,
    });

  } catch (error) {
    console.error("Error:", error);
    return next(new AppError(error.message, 500));
  }
});




module.exports = {
  getPackingLicences,
  getPartnerShipDeedPreparation,
  getIncomeTaxFilings,
  fetchPassport,
  fetchKswift,
  getPancardDetails,
  getBusBookings,
  getFssaiRegistrations,
  getFssaiLicence,
  getGstRegistrations,
  getGstFilings,
  fetchTrainBookingDetails,
  fetchUdyamRegistrationDetails,
  fetchFinancialStatements,
  fetchCompanyFormationDetails,
  getVehicleInsurance,
  getAllWorks,
  getAllWorksByStaffId,
  getAllWorksByFranchise
};
