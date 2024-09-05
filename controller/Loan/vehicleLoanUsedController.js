const catchAsync = require("../../utils/catchAsync");
const AppError = require("../../utils/appError");
const Franchise = require("../../db/models/franchise");
const azureStorage = require("azure-storage");
const intoStream = require("into-stream");
const usedVehicleLoan = require("../../db/models/vehicleloanused");
const containerName = "imagecontainer";
const blobService = azureStorage.createBlobService(
  process.env.AZURE_STORAGE_CONNECTION_STRING
);

const { Op } = require("sequelize"); // Import Sequelize operators

const uploadBlob = (file) => {
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
          return reject(`Error uploading file ${blobName}: ${err.message}`);
        }
        const blobUrl = blobService.getUrl(containerName, blobName);
        resolve(blobUrl);
      }
    );
  });
};

const createUsedVehicleLoan = catchAsync(async (req, res, next) => {
  const {
    customerName,
    mobileNumber,
    emailId,
    typeofLoan,
    cibil,
    cibilScore,
    status,
    assignedId,
    assignedOn,
    completedOn,
  } = req.body;

  if (!req.files) {
    return next(new AppError("Files not uploaded", 400));
  }

  console.log("body:", req.body);
  console.log("files:", req.files);

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

  const salarySlipUrl = await uploadFile(req.files.salarySlip);
  const bankStatementUrl = await uploadFile(req.files.bankStatement);
  const cancelledChequeUrl = await uploadFile(req.files.cancelledCheque);
  const photoUrl = await uploadFile(req.files.photo);
  const invoiceFromDealerUrl = await uploadFile(req.files.invoiceFromDealer);
  const ITRUrl = await uploadFile(req.files.ITR);
  const rentAgreementUrl = await uploadFile(req.files.rentAgreement);
  const insuranceCopyUrl = await uploadFile(req.files.insuranceCopy);
  const RCCopyUrl = await uploadFile(req.files.RC_Copy);
  const panchayathOrMuncipleLicenceUrl = await uploadFile(
    req.files.panchayathOrMuncipleLicence
  );

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

  let additionalData = {};

  switch (typeofLoan) {
    case "salaried":
      additionalData = {
        salarySlip: salarySlipUrl,
        bankStatement: bankStatementUrl,
        cancelledCheque: cancelledChequeUrl,
        photo: photoUrl,
        invoiceFromDealer: invoiceFromDealerUrl,
        insuranceCopy: insuranceCopyUrl,
        RC_Copy: RCCopyUrl,
      };
      break;

    case "business":
      additionalData = {
        ITR: ITRUrl,
        bankStatement: bankStatementUrl,
        rentAgreement: rentAgreementUrl,
        panchayathOrMuncipleLicence: panchayathOrMuncipleLicenceUrl,
        cancelledCheque: cancelledChequeUrl,
        photo: photoUrl,
        invoiceFromDealer: invoiceFromDealerUrl,
        insuranceCopy: insuranceCopyUrl,
        RC_Copy: RCCopyUrl,
      };
      break;
    default:
      break;
  }

  if (cibil === "approved") {
    const cibilReportUrl = await uploadFile(req.files.cibilReport);
    additionalData = {
      ...additionalData,
      cibilScore,
      cibilReport: cibilReportUrl,
    };
  } else {
    const acknowledgmentUrl = await uploadFile(req.files.acknowledgment);
    additionalData = {
      ...additionalData,
      acknowledgment: acknowledgmentUrl,
    };
  }

  const currentDate = new Date()
    .toISOString()
    .slice(0, 10)
    .split("-")
    .reverse()
    .join("");
  const count = await usedVehicleLoan(typeofLoan, cibil).count({
    where: {
      workId: {
        [Op.like]: `${currentDate}VLE%`,
      },
    },
  });
  const workId = `${currentDate}VLE${(count + 1).toString().padStart(3, "0")}`;

  const vehicleLoan = usedVehicleLoan(typeofLoan, cibil);

  const createdVehicleLoan = await vehicleLoan.create({
    uniqueId,
    workId,
    customerName,
    mobileNumber,
    emailId,
    typeofLoan,
    cibil,
    ...additionalData,
    status,
    assignedId,
    assignedOn,
    completedOn,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  if (!createdVehicleLoan) {
    return next(new AppError("New Vehicle Loan Creation Failed", 500));
  }

  return res.status(201).json({
    status: "Created",
    data: createdVehicleLoan,
  });
});

module.exports = { createUsedVehicleLoan };


 