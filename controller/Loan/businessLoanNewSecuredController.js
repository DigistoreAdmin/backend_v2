const Franchise = require("../../db/models/franchise");
const defineBusinessLoanNewSecured = require("../../db/models/businessLoanNewSecured");
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

const uploadMultipleFiles = async (files) => {
  if (!Array.isArray(files)) {
    files = [files];
  }
  const uploadPromises = files.map((file) => uploadFile(file));
  const uploadedUrls = await Promise.all(uploadPromises);
  return uploadedUrls;
};

const uploadFile = async (file) => (file ? await uploadBlob(file) : null);

const createBusinessLoanNewSecured = catchAsync(async (req, res) => {
  try {
    const {
      loanAmount,
      cibil,
      cibilScore,
      customerName,
      phoneNumber,
      email,
      status,
      assignedId,
      assignedOn,
      completedOn,
    } = req.body;
    const {
      cibilReport,
      cibilAcknowledgement,
      sourceOfIncome,
      licenceCopy,
      otherDocuments,
      rentAgreement,
      titleDeed,
      locationSketch,
      encumbrance,
      possession,
      buildingTax,
      landTax,
      invoiceCopyOfAssetsToPurchase,
    } = req.files;

    if (!req.files) {
      throw new AppError("Files not uploaded", 400);
    }

    const titleDeedUrl = await uploadFile(titleDeed);
    const locationSketchUrl = await uploadFile(locationSketch);
    const encumbranceUrl = await uploadFile(encumbrance);
    const possessionUrl = await uploadFile(possession);
    const buildingTaxUrl = await uploadFile(buildingTax);
    const landTaxUrl = await uploadFile(landTax);
    const invoiceCopyOfAssetsToPurchaseUrl = await uploadFile(
      invoiceCopyOfAssetsToPurchase
    );

    const rentAgreementUrl = await uploadFile(rentAgreement);
    const licenceCopyUrl = await uploadFile(licenceCopy);
    const otherDocumentsUrl = await uploadMultipleFiles(otherDocuments);
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

    const BusinessLoanNewSecured = defineBusinessLoanNewSecured(cibil);
    let workID = "";
    const newBusinessLoanNewSecured = await BusinessLoanNewSecured.create({
      uniqueId: uniqueId,
      workID,
      customerName,
      phoneNumber,
      email,
      titleDeed: titleDeedUrl,
      locationSketch: locationSketchUrl,
      encumbrance: encumbranceUrl,
      possession: possessionUrl,
      buildingTax: buildingTaxUrl,
      landTax: landTaxUrl,
      invoiceCopyOfAssetsToPurchase: invoiceCopyOfAssetsToPurchaseUrl,
      rentAgreement: rentAgreementUrl,
      licenceCopy: licenceCopyUrl,
      otherDocuments: otherDocumentsUrl,
      loanAmount,
      sourceOfIncome: sourceOfIncomeUrl,
      cibil,
      cibilScore,
      cibilAcknowledgement: cibilAcknowledgementUrl,
      cibilReport: cibilReportUrl,
      status,
      assignedId,
      assignedOn,
      completedOn,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    console.log(newBusinessLoanNewSecured);
    res.status(201).json({ newBusinessLoanNewSecured });
  } catch (error) {
    console.error("Error creating business loan new-secured:", error);
    res.status(500).json({ error: "Failed to business loan new-secured" });
  }
});

module.exports = { createBusinessLoanNewSecured };
