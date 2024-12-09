const kswift = require("../db/models/kswift");
const panCardUsers = require("../db/models/pancard");
const definePassportDetails = require("../db/models/passport");
const defineTainBooking = require("../db/models/trainbooking");
const udyamRegistrations = require("../db/models/udyamregistration");
const financialstatements = require("../db/models/financialstatements");
const companyFormations = require("../db/models/companyformation");
const BusBooking = require("../db/models/busbooking");
const fssaiRegistrations = require("../db/models/fssairegistration");
const fssaiLicences = require("../db/models/fssailicence");
const defineGstRegistrationDetails = require("../db/models/gstregistration");
const gstFilings = require("../db/models/gstfiling");
const defineIncomeTaxFilingDetails = require("../db/models/incometax");
const partnerShipDeedTable = require("../db/models/partnershipdeedpreperation");
const packingLicence = require("../db/models/packinglicences");
const defineVehicleInsurance = require("../db/models/vehicleInsurance");
const defineLoanAgainstProperty = require("../db/models/loanAgainstProperty");
const defineBusinessLoanUnscuredExisting = require("../db/models/BusinessLoanUnsecuredExisting");
const defineHousingLoan = require("../db/models/HousingLoan");
const defineBusinessLoanNewSecured = require("../db/models/businessLoanNewSecured");
const defineNewVehicleLoan = require("../db/models/newvehicleloan");
const defineUsedVehicleLoan = require("../db/models/vehicleloanused");
const definePersonalLoan = require("../db/models/personalloan");
const defineBusinessLoanUnsecuredNew = require("../db/models/businessloanunsecurednew");
const defineBusinessLoanExistingDetails = require("../db/models/businessloanexisting");
const microLoans = require("../db/models/microloan");
const defineMedicalInsuranceData = require("../db/models/medicalinsurance");
const microLoanShop = require("../db/models/microloansshop");

const models = [
    panCard=panCardUsers(),
    passport=definePassportDetails(),
    kswift,
    trainBooking=defineTainBooking(),
    udyamRegistrations,
    financialstatements,
    companyFormations,
    BusBooking,
    fssaiRegistrations,
    fssaiLicences,
    gstRegistrationDetails=defineGstRegistrationDetails(),
    gstFilings,
    incomeTaxFilingDetails=defineIncomeTaxFilingDetails(),
    partnerShipDeedTable,
    packingLicence,
    vehicleInsurance=defineVehicleInsurance,
    loanAgainstProperty=defineLoanAgainstProperty(),
    businessLoanUnscuredExisting=defineBusinessLoanUnscuredExisting(),
    housingLoan=defineHousingLoan(),
    businessLoanNewSecured=defineBusinessLoanNewSecured(),
    newVehicleLoan=defineNewVehicleLoan(),
    usedVehicleLoan=defineUsedVehicleLoan(),
    personalLoan=definePersonalLoan(),
    businessLoanUnsecuredNew=defineBusinessLoanUnsecuredNew(),
    businessLoanExistingDetails=defineBusinessLoanExistingDetails(),
    microLoans,
    medicalInsuranceData=defineMedicalInsuranceData(),
    microLoanShop,
  ];
  
  const workStatus = async (req, res) => {
    try {
      const { workId } = req.body;
  
      if (!workId) {
        return res.status(400).json({ message: "WorkId is required" });
      }
  
      const validModels = models.filter(
        (model) => model && typeof model.findOne === "function"
      );
  
      let updated = false;
  
      for (const model of validModels) {
        const record = await model.findOne({ where: { workId } });
  
        if (record) {
          if (record.status === "inQueue") {
          
            await model.update(
              { status: "inProgress" },
              { where: { workId } }
            );
            updated = true;
            return res.status(200).json({
              message: `WorkId ${workId} status updated to inProgress in table ${model.name}.`,
            });
          } else {
            return res.status(200).json({
              message: `WorkId ${workId} already has status: ${record.status}.`,
            });
          }
        }
      }
  
      if (!updated) {
        return res
          .status(404)
          .json({ message: `WorkId ${workId} not found in any table.` });
      }

    } catch (error) {
      console.error("Error:", error.message);
      return res.status(500).json({
        message: "An error occurred while checking work status",
      });
    }
  };
  
  module.exports = { workStatus };
  

  
