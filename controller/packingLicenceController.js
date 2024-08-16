const packingLicence = require("../db/models/packinglicences");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const Franchise = require("../db/models/franchise");
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

const createPackingLicence = catchAsync(async (req, res, next) => {
  const user = req.user;
  if (!user) {
    return next(new AppError("User not authenticated", 401));
  }
  const franchiseData = await Franchise.findOne({
    where: { email: user.email },
  });
  if (!franchiseData) {
    return next(new AppError("Franchise data not found", 404));
  }

  const uniqueId = franchiseData.franchiseUniqueId;

  const {
    customerName,
    email,
    phoneNumber,
    panNumber,
    businessName,
    businessAddressLine1,
    businessAddressLine2,
    pinCode,
    listOfProducts,
  } = req.body;

  const {
    aadhaarFront,
    aadhaarBack,
    panCard,
    fassaiRegistrationCertificate,
    buildingTaxReceipt,
    rentAgreement,
    ownershipCertificate,
    selfDeclaration,
    photo,
    signature,
  } = req.files;

  console.log("reqbody=", req.body);
  console.log("req files=", req.files);
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

  const aadhaarFrontUrl = await uploadFile(aadhaarFront);
  const aadhaarBackUrl = await uploadFile(aadhaarBack);
  const panCardUrl = await uploadFile(panCard);
  const fassaiRegistrationCertificateUrl = await uploadFile(
    fassaiRegistrationCertificate
  );
  const buildingTaxReceiptUrl = await uploadFile(buildingTaxReceipt);
  const rentAgreementUrl = await uploadFile(rentAgreement);
  const ownershipCertificateUrl = await uploadFile(ownershipCertificate);
  const selfDeclarationUrl = await uploadFile(selfDeclaration);
  const photoUrl = await uploadFile(photo);
  const signatureUrl = await uploadFile(signature);

  const newPackingLicence = await packingLicence.create({
    uniqueId,
    customerName,
    email,
    phoneNumber,
    panNumber,
    businessName,
    businessAddressLine1,
    businessAddressLine2,
    pinCode,
    listOfProducts,
    aadhaarFront: aadhaarFrontUrl,
    aadhaarBack: aadhaarBackUrl,
    panCard: panCardUrl,
    fassaiRegistrationCertificate: fassaiRegistrationCertificateUrl,
    buildingTaxReceipt: buildingTaxReceiptUrl,
    rentAgreement: rentAgreementUrl,
    ownershipCertificate: ownershipCertificateUrl,
    selfDeclaration: selfDeclarationUrl,
    photo: photoUrl,
    signature: signatureUrl,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  console.log("createdAt:", new Date());
  console.log("updatedAt:", new Date());

  if (!newPackingLicence) {
    return next(new AppError("Booking failed", 500));
  }
  return res.status(200).json({
    status: "success",
    data: newPackingLicence,
  });
});

module.exports = { createPackingLicence };
