const busbooking = require("../db/models/busbooking");
const businessLoanExistingDetails = require("../db/models/businessloanexisting");
const defineBusinessLoanNewSecured = require("../db/models/businessLoanNewSecured");
const defineBusinessLoanUnscuredExisting = require("../db/models/BusinessLoanUnsecuredExisting");
const defineBusinessLoanUnsecuredNew = require("../db/models/businessloanunsecurednew");
const CompanyFormations = require("../db/models/companyformation");
const FinancialStatements = require("../db/models/financialstatements");
const fssaiLicences = require("../db/models/fssailicence");
const fssaiRegistrations = require("../db/models/fssairegistration");
const GstFilings = require("../db/models/gstfiling");
const gstRegistrationDetails = require("../db/models/gstregistration");
const defineHousingLoan = require("../db/models/HousingLoan");
const incomeTaxFilingDetails = require("../db/models/incometax");
const kswift = require("../db/models/kswift");
const loanAgainstProperty = require("../db/models/loanAgainstProperty");
const medicalInsuranceData = require("../db/models/medicalinsurance");
const microLoans = require("../db/models/microloan");
const microLoansShop = require("../db/models/microloansshop");
const newVehicleLoan = require("../db/models/newvehicleloan");
const PackingLicences = require("../db/models/packinglicences");
const definePancardUser = require("../db/models/pancard");
const definePassportDetails = require("../db/models/passport");
const definePersonalLoan = require("../db/models/personalloan");
const defineStaffsDetails = require("../db/models/staffs");
const UdyamRegistrations = require("../db/models/udyamregistration");
const defineVehicleInsurance = require("../db/models/vehicleInsurance");
const usedvehicleLoan = require("../db/models/vehicleloanused");
const partnerShipDeedTable = require("../db/models/partnershipdeedpreperation");
const workTimeDb = require("../db/models/worktime");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const defineTrainBooking = require("../db/models/trainbooking");

const timeLineController = catchAsync(async (req, res, next) => {
  const { workId } = req.body;
  if (!workId) {
    return next(new AppError("work id not found", 401));
  }
  const gstRegistration = gstRegistrationDetails();
  const passport = definePassportDetails();
  const incomeTaxTable = incomeTaxFilingDetails();
  const vehicleInsurance = defineVehicleInsurance();
  const panCard = definePancardUser();
  const loanAgainstPropertyDetails = loanAgainstProperty();
  const defineBusinessLoanUnsecuredExistingDetails =
    defineBusinessLoanUnscuredExisting();
  const defineHousingLoanDetails = defineHousingLoan();
  const defineBusinessLoanNewSecuredDetails = defineBusinessLoanNewSecured();
  const newVehicleLoanDetails = newVehicleLoan();
  const usedVehicleLoanDetails = usedvehicleLoan();
  const definePersonalLoanDetails = definePersonalLoan();
  const defineBusinessLoanUnsecuredNewDetails =
    defineBusinessLoanUnsecuredNew();
  const businessLoanExistingDetailsDetails = businessLoanExistingDetails();
  const medicalInsurance = medicalInsuranceData();
  const trainBooking = defineTrainBooking();

  const tables = [
    kswift,
    fssaiRegistrations,
    fssaiLicences,
    UdyamRegistrations,
    FinancialStatements,
    CompanyFormations,
    PackingLicences,
    partnerShipDeedTable,
    GstFilings,
    passport,
    busbooking,
    panCard,
    microLoans,
    medicalInsurance,
    microLoansShop,
    incomeTaxTable,
    vehicleInsurance,
    loanAgainstPropertyDetails,
    defineBusinessLoanUnsecuredExistingDetails,
    defineBusinessLoanNewSecuredDetails,
    defineHousingLoanDetails,
    newVehicleLoanDetails,
    usedVehicleLoanDetails,
    definePersonalLoanDetails,
    defineBusinessLoanUnsecuredNewDetails,
    businessLoanExistingDetailsDetails,
    trainBooking,
    gstRegistration,
  ];

  const results = await Promise.all(
    tables.map((table) => table.findOne({ where: { workId: workId } }))
  );

  // Filter out null results and find the first valid result
  const foundRecord = results.find((result) => result !== null);
  if (foundRecord) {
    const franchiseUniqueId = foundRecord.dataValues.uniqueId;
    const workCreatedTime = foundRecord.dataValues.createdAt;

    try {
      const workTime = await workTimeDb.findOne({ where: { workId: workId } });

      if (!workTime) {
        return next(new AppError("Work Time not found", 404));
      }

      const workTimeData = workTime.employeeRecords.map((record) => ({
        staffName: record.staffName.trim(),
        startTime: record.startTime.toString(),
        reassignedTime: record.reassignedTime || null,
        totalTimeTaken: record.totalTimeTaken,
      }));

      // Response object
      const responseData = {
        workId: workId,
        franchiseUniqueId: franchiseUniqueId,
        workCreatedTime: workCreatedTime,
        workerData: workTimeData,
      };

      console.log("Response:", responseData);
      res.status(200).json(responseData);
    } catch (error) {
      console.error("Error fetching Work Time:", error);
      return next(new AppError("Database error while fetching work", 500));
    }
  } else {
    console.log("WorkId not found in any table");
    return next(new AppError("WorkId not found in any table", 404));
  }
});

module.exports = { timeLineController };
