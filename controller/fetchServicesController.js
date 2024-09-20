const panCardUsers = require("../db/models/pancard");
const definePassportDetails = require("../db/models/passport");
const Franchise = require("../db/models/franchise");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const kswift = require("../db/models/kswift");
const defineStaffsDetails = require("../db/models/staffs");
const trainBooking = require("../db/models/trainbooking")
const udyamRegistrations = require("../db/models/udyamregistration");
const financialstatements = require("../db/models/financialstatements");
const companyFormations = require("../db/models/companyformation")
const BusBooking = require("../db/models/busbooking");
const fssaiRegistrations = require("../db/models/fssairegistration");
const fssaiLicences = require("../db/models/fssailicence");
const gstRegistrationDetails = require("../db/models/gstregistration");
const gstFilings = require("../db/models/gstfiling");
const incomeTaxFilingDetails = require("../db/models/incometax");
const partnerShipDeedTable = require("../db/models/partnershipdeedpreperation");
const packingLicence = require("../db/models/packinglicences");


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



const fetchTrainBookingDetails = catchAsync(async(req,res)=>{
    
        try {
              const {page,pageLimit} = req.query
    
              if (!page || !pageLimit) {
                return res.status(400).json({ error: "page and pageSize are required" });
              }
            
              const pageNumber = parseInt(page, 10);
              const pageLimitNumber = parseInt(pageLimit, 10);
            
              const limit = pageLimitNumber;
              const offset = (pageNumber - 1) * limit;
    
    
            const Data= await trainBooking.findAndCountAll({limit,offset})

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
})

const fetchUdyamRegistrationDetails = catchAsync(async(req,res)=>{
  try {
    const {page,pageLimit} = req.query

    if (!page || !pageLimit) {
      return res.status(400).json({ error: "page and pageSize are required" });
    }
  
    const pageNumber = parseInt(page, 10);
    const pageLimitNumber = parseInt(pageLimit, 10);
  
    const limit = pageLimitNumber;
    const offset = (pageNumber - 1) * limit;


  const Data= await udyamRegistrations.findAndCountAll({limit,offset})

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
})

const fetchFinancialStatements = catchAsync(async(req,res)=>{
  try {
    const {page,pageLimit} = req.query

    if (!page || !pageLimit) {
      return res.status(400).json({ error: "page and pageSize are required" });
    }
  
    const pageNumber = parseInt(page, 10);
    const pageLimitNumber = parseInt(pageLimit, 10);
  
    const limit = pageLimitNumber;
    const offset = (pageNumber - 1) * limit;


  const Data= await financialstatements.findAndCountAll({limit,offset})

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
})

const fetchCompanyFormationDetails = catchAsync(async(req,res)=>{
  try {
    const {page,pageLimit} = req.query

    if (!page || !pageLimit) {
      return res.status(400).json({ error: "page and pageSize are required" });
    }
  
    const pageNumber = parseInt(page, 10);
    const pageLimitNumber = parseInt(pageLimit, 10);
  
    const limit = pageLimitNumber;
    const offset = (pageNumber - 1) * limit;


  const Data= await companyFormations.findAndCountAll({limit,offset})

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
})



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
  fetchCompanyFormationDetails
};

