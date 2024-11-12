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
const WorkTime = require("../db/models/worktime");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const defineTrainBooking = require("../db/models/trainbooking");

const reassign = catchAsync(async (req, res, next) => {
  const { workId, assignedId } = req.body;

  if (!workId) {
    return res.status(400).json({ error: "workId is required" });
  }

  if (!assignedId) {
    return res.status(400).json({ error: "AssignedId is required" });
  }

  const Staff = defineStaffsDetails();

  const staffExists = await Staff.findOne({
      where: { employeeId: assignedId },
    });
 
  const staffName=staffExists.firstName
  console.log('staffName: ', staffName);

  if (!staffExists) {
    return next(new AppError("Staff not found", 404));
  }

  const workIdExist = await WorkTime.findOne({
    where: { workId:workId },
  });
  console.log('workIdExist: ', workIdExist);

  if (!workIdExist) {
    return next(new AppError("WorkId not found", 404));
  }

  const newEmployeeRecord = {
    staffName,
    assignedId,
    reassigned: true,
    reassignedTime: new Date(),
  };

  // Update the employeeRecords by adding the new record
  const updatedEmployeeRecords = [...workIdExist.employeeRecords, newEmployeeRecord];

  await workIdExist.update({ employeeRecords: updatedEmployeeRecords });

  const gstRegistration = gstRegistrationDetails();
  const passport = definePassportDetails();
  const incomeTaxTable = incomeTaxFilingDetails();
  const vehicleInsurance = defineVehicleInsurance();
  const panCard = definePancardUser();
  const loanAgainstPropertyDetails = loanAgainstProperty();
  const defineBusinessLoanUnsecuredExistingDetails = defineBusinessLoanUnscuredExisting();
  const defineHousingLoanDetails = defineHousingLoan();
  const defineBusinessLoanNewSecuredDetails = defineBusinessLoanNewSecured();
  const newVehicleLoanDetails = newVehicleLoan();
  const usedVehicleLoanDetails = usedvehicleLoan();
  const definePersonalLoanDetails = definePersonalLoan();
  const defineBusinessLoanUnsecuredNewDetails = defineBusinessLoanUnsecuredNew();
  const businessLoanExistingDetailsDetails = businessLoanExistingDetails();
  const medicalInsurance = medicalInsuranceData();
  const trainBooking=defineTrainBooking()

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
    trainBooking
];
const results = await Promise.all(
  tables.map((table) => table.findOne({ where: { workId } }))
);

const index = results.findIndex((record) => record !== null);

if (index === -1) {
  return next(new AppError("Service not found", 404));
}

await tables[index].update(
  { assignedId: assignedId, assignedOn: new Date() },
  { where: { workId } }
);

  res.status(200).json({
    status: "success",
    message: "Staff reassigned successfully",
  });
});

module.exports = { reassign };
