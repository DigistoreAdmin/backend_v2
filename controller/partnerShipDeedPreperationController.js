const PartnershipDeedPreparation = require("../db/models/partnershipdeedpreperation");
const Franchise = require("../db/models/franchise");
const azureStorage = require("azure-storage");
const intoStream = require("into-stream");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

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

const createPartnerShipDeedPreperation = catchAsync(async (req, res, next) => {
  const {
    customerName,
    email,
    phoneNumber,
    businessName,
    businessAddress,
    numberOfPartners,
  } = req.body;

  const {
    bankAmountStatement,
    rentOrLeaseAgreement,
    latestPropertyTax,
    LandTaxRecipt,
  } = req.files;

  if (!req.files) {
    return next(new AppError("Files not uploaded", 400));
  }

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

  let updatedPartnersDetails = [];

  for (let i = 1; i <= numberOfPartners; i++) {
    const partnerNo = `${i}`;
    const panCardFile = req.files[`partner${i}panCard`];
    const aadhaarFrontFile = req.files[`partner${i}aadhaarFront`];
    const aadhaarBackFile = req.files[`partner${i}aadhaarBack`];
    const photoFile = req.files[`partner${i}photo`];
    const signatureFile = req.files[`partner${i}signature`];
    const addressLine1 = req.body[`partner${i}addressLine1`];
    const addressLine2 = req.body[`partner${i}addressLine2`];

    if (
      panCardFile &&
      aadhaarFrontFile &&
      aadhaarBackFile &&
      photoFile &&
      signatureFile &&
      addressLine1 &&
      addressLine2
    ) {
      try {
        const panCardBlobUrl = await uploadFile(panCardFile);
        const aadhaarFrontBlobUrl = await uploadFile(aadhaarFrontFile);
        const aadhaarBackBlobUrl = await uploadFile(aadhaarBackFile);
        const photoBlobUrl = await uploadFile(photoFile);
        const signatureBlobUrl = await uploadFile(signatureFile);

        updatedPartnersDetails.push({
          partnerNo: partnerNo,
          panCard: panCardBlobUrl,
          aadhaarFront: aadhaarFrontBlobUrl,
          aadhaarBack: aadhaarBackBlobUrl,
          photo: photoBlobUrl,
          signature: signatureBlobUrl,
          addressLine1: addressLine1,
          addressLine2: addressLine2,
        });
      } catch (error) {
        return next(new AppError("Error processing files", 500));
      }
    } else {
      return next(new AppError("Missing required files", 400));
    }
  }

  const bankAmountStatementBlobUrl = await uploadFile(bankAmountStatement);
  const rentOrLeaseAgreementBlobUrl = await uploadFile(rentOrLeaseAgreement);
  const latestPropertyTaxBlobUrl = await uploadFile(latestPropertyTax);
  const landTaxReciptBlobUrl = await uploadFile(LandTaxRecipt);

  const newPartnershipDeedPreparation = await PartnershipDeedPreparation.create(
    {
      uniqueId,
      customerName,
      email,
      phoneNumber,
      businessName,
      businessAddress,
      numberOfPartners,
      partners: updatedPartnersDetails,
      bankAmountStatement: bankAmountStatementBlobUrl,
      rentOrLeaseAgreement: rentOrLeaseAgreementBlobUrl,
      latestPropertyTax: latestPropertyTaxBlobUrl,
      LandTaxRecipt: landTaxReciptBlobUrl,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
  );

  if (!newPartnershipDeedPreparation) {
    return next(
      new AppError("Partnership Deed Preparation Filing Failed", 500)
    );
  }

  return res.status(200).json({
    status: "success",
    data: newPartnershipDeedPreparation,
  });
});

module.exports = { createPartnerShipDeedPreperation };


