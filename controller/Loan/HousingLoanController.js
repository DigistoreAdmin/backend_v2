const Franchise = require("../../db/models/franchise");
const defineHousingLoan = require("../../db/models/HousingLoan");
const catchAsync = require("../../utils/catchAsync");

const azureStorage = require("azure-storage");
const intoStream = require("into-stream");

const containerName = "imagecontainer";
const blobService = azureStorage.createBlobService(
  process.env.AZURE_STORAGE_CONNECTION_STRING
);
// };

const uploadBlob = async (file) => {
  return new Promise((resolve, reject) => {
    const blobName = file.name;
    const stream = intoStream(file.data);
    const streamLength = file.data.length;

    blobService.createBlockBlobFromStream(
      containerName,
      blobName,
      stream,
      streamLength,
      (err) => {
        if (err) {
          return reject(err);
        }
        const blobUrl = blobService.getUrl(containerName, blobName);
        resolve(blobUrl);
      }
    );
  });
};

const uploadFile = async (file) => (file ? await uploadBlob(file) : null);

const createHousingLoan = catchAsync(async (req, res) => {
  try {
    console.log(req.files);
    const {
      loanAmount,
      cibil,
      cibilScore,
      customerName,
      phoneNumber,
      email,
      isSalariedOrBusiness,
      status,
      assignedId,
      assignedOn,
      completedOn,
    } = req.body;
    const {
      salarySlip,
      cibilReport,
      sourceOfIncome,
      cibilAcknowledgement,
      coApplicantSalarySlip,
      bankStatement,
      coApplicantBankStatement,
      cancelledCheque,
      coApplicantCancelledCheque,
      photo,
      coApplicantPhoto,
      itr,
      coApplicantItr,
      rentAgreement,
      coApplicantRentAgreement,
      municipalLicence,
      coApplicantMunicipalLicence,
      titleDeed,
      locationSketch,
      encumbrance,
      possession,
      buildingTax,
      landTax,
      estimatePlan,
    } = req.files;

    if (!req.files) {
      throw new AppError("Files not uploaded", 400);
    }
    const salarySlipUrl = await uploadFile(salarySlip);
    const coApplicantSalarySlipUrl = await uploadFile(coApplicantSalarySlip);
    const bankStatementUrl = await uploadFile(bankStatement);
    const coApplicantBankStatementUrl = await uploadFile(
      coApplicantBankStatement
    );
    const cancelledChequeUrl = await uploadFile(cancelledCheque);
    const coApplicantCancelledChequeUrl = await uploadFile(
      coApplicantCancelledCheque
    );
    const photoUrl = await uploadFile(photo);
    const coApplicantPhotoUrl = await uploadFile(coApplicantPhoto);
    const titleDeedUrl = await uploadFile(titleDeed);
    const locationSketchUrl = await uploadFile(locationSketch);
    const encumbranceUrl = await uploadFile(encumbrance);
    const possessionUrl = await uploadFile(possession);
    const buildingTaxUrl = await uploadFile(buildingTax);
    const landTaxUrl = await uploadFile(landTax);
    const estimatePlanUrl = await uploadFile(estimatePlan);
    const itrUrl = await uploadFile(itr);
    const coApplicantItrUrl = await uploadFile(coApplicantItr);
    const rentAgreementUrl = await uploadFile(rentAgreement);
    const coApplicantRentAgreementUrl = await uploadFile(
      coApplicantRentAgreement
    );
    const municipalLicenceUrl = await uploadFile(municipalLicence);
    const coApplicantMunicipalLicenceUrl = await uploadFile(
      coApplicantMunicipalLicence
    );
    const cibilReportUrl = await uploadFile(cibilReport);
    const cibilAcknowledgementUrl = await uploadFile(cibilAcknowledgement);
    const sourceOfIncomeUrl = await uploadFile(sourceOfIncome);

    const user = req.user;
    if (!user) {
      return next(new AppError("User not found", 401));
    }
    const franchise = await Franchise.findOne({
      where: { email: user.email },
    });
    const uniqueId = franchise.franchiseUniqueId;
    if (!uniqueId) {
      return next(new AppError("Missing unique id for the franchise", 400));
    }

    const HousingLoan = defineHousingLoan(isSalariedOrBusiness, cibil);
    let workID = "";
    const newHousingLoan = await HousingLoan.create({
      uniqueId: uniqueId,
      workID,
      customerName,
      phoneNumber,
      email,
      salarySlip: salarySlipUrl,
      isSalariedOrBusiness,
      coApplicantSalarySlip: coApplicantSalarySlipUrl,
      bankStatement: bankStatementUrl,
      coApplicantBankStatement: coApplicantBankStatementUrl,
      cancelledCheque: cancelledChequeUrl,
      coApplicantCancelledCheque: coApplicantCancelledChequeUrl,
      photo: photoUrl,
      coApplicantPhoto: coApplicantPhotoUrl,
      itr: itrUrl,
      coApplicantItr: coApplicantItrUrl,
      rentAgreement: rentAgreementUrl,
      coApplicantRentAgreement: coApplicantRentAgreementUrl,
      municipalLicence: municipalLicenceUrl,
      coApplicantMunicipalLicence: coApplicantMunicipalLicenceUrl,
      cibil,
      cibilScore,
      cibilAcknowledgement: cibilAcknowledgementUrl,
      cibilReport: cibilReportUrl,
      loanAmount,
      sourceOfIncome: sourceOfIncomeUrl,

      status,
      assignedId,
      assignedOn,
      completedOn,
      titleDeed: titleDeedUrl,
      locationSketch: locationSketchUrl,
      encumbrance: encumbranceUrl,
      possession: possessionUrl,
      buildingTax: buildingTaxUrl,
      landTax: landTaxUrl,
      estimatePlan: estimatePlanUrl,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    console.log(newHousingLoan);
    res.status(201).json({ newHousingLoan });
  } catch (error) {
    console.error("Error creating Housing Loan:", error);
    res.status(500).json({ error: "Failed to create Housing Loan" });
  }
});

module.exports = { createHousingLoan };
