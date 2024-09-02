const Franchise = require("../../db/models/franchise");
const LoanAgainstProperty = require("../../db/models/loanAgainstProperty");
const catchAsync = require("../../utils/catchAsync");

const azureStorage = require("azure-storage");
const intoStream = require("into-stream");

const containerName = "imagecontainer";
const blobService = azureStorage.createBlobService(
  process.env.AZURE_STORAGE_CONNECTION_STRING
);

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

const createLoanAgainstProperty = catchAsync(async (req, res) => {
  try {
    const {
      cibil,
      cibilScore,
      loanAmount,
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
      cibilAcknowledgement,
      cibilReport,
      sourceOfIncome

    } = req.files;

    console.log("FilesName", req.files);

    const uploadFile = async (file) => {
      if (file) {
        try {
          return await uploadBlob(file);
        } catch (error) {
          console.error(`Error uploading file ${file.name}:`, error);
          return null;
        }
      } else {
        console.error("File is missing:", file);
        return null;
      }
    };

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
    const itrUr = await uploadFile(itr);
    const coApplicantItrUrl = await uploadFile(coApplicantItr);
    const rentAgreementUrl = await uploadFile(rentAgreement);
    const coApplicantRentAgreementUrl = await uploadFile(
      coApplicantRentAgreement
    );
    const municipalLicenceUrl = await uploadFile(municipalLicence);
    const coApplicantMunicipalLicenceUrl = await uploadFile(
      coApplicantMunicipalLicence
    );
    const titleDeedUrl = await uploadFile(titleDeed);
    const locationSketchUrl = await uploadFile(locationSketch);
    const encumbranceUrl = await uploadFile(encumbrance);
    const possessionUrl = await uploadFile(possession);
    const buildingTaxUrl = await uploadFile(buildingTax);
    const landTaxUrl = await uploadFile(landTax);

    const cibilAcknowledgementUrl = await uploadFile(cibilAcknowledgement);
    const cibilReportUrl = await uploadFile(cibilReport);
    const sourceOfIncomeUrl = await uploadBlob(sourceOfIncome);

    const user = req.user;

    const franchise = await Franchise.findOne({
      where: { email: user.email },
    });

    uniqueId = franchise.franchiseUniqueId;
    console.log("uniqueId", uniqueId);

    const LoanAgainstProperties = LoanAgainstProperty(isSalariedOrBusiness, cibil);

    const newLoan = await LoanAgainstProperties.create({
      uniqueId,
      cibil,
      customerName,
      phoneNumber,
      email,
      cibilScore,
      loanAmount,
      salarySlip: salarySlipUrl,
      isSalariedOrBusiness,
      coApplicantSalarySlip: coApplicantSalarySlipUrl,
      bankStatement: bankStatementUrl,
      coApplicantBankStatement: coApplicantBankStatementUrl,
      cancelledCheque: cancelledChequeUrl,
      coApplicantCancelledCheque: coApplicantCancelledChequeUrl,
      photo: photoUrl,
      coApplicantPhoto: coApplicantPhotoUrl,
      itr: itrUr,
      coApplicantItr: coApplicantItrUrl,
      rentAgreement: rentAgreementUrl,
      coApplicantRentAgreement: coApplicantRentAgreementUrl,
      municipalLicence: municipalLicenceUrl,
      coApplicantMunicipalLicence: coApplicantMunicipalLicenceUrl,
      titleDeed: titleDeedUrl,
      locationSketch: locationSketchUrl,
      encumbrance: encumbranceUrl,
      possession: possessionUrl,
      buildingTax: buildingTaxUrl,
      landTax: landTaxUrl,
      cibilAcknowledgement: cibilAcknowledgementUrl,
      cibilReport: cibilReportUrl,
      sourceOfIncome: sourceOfIncomeUrl,
      status,
      assignedId,
      assignedOn,
      completedOn,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    if (!newLoan) {
      return res.status(400).json({
        status: "fail",
        message: "Invalid data",
      });
    }

    res.status(201).json({
      status: "success",
      data: newLoan,
    });
  } catch (error) {
    console.error("Error creating loan:", error);
    res.status(500).json({ error: "Failed to create loan" });
  }
});

module.exports = { createLoanAgainstProperty };
