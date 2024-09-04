const catchAsync = require("../../utils/catchAsync");
const AppError = require("../../utils/appError");
const Franchise = require("../../db/models/franchise");
const azureStorage = require("azure-storage");
const intoStream = require("into-stream");
const cibilReport = require("../../db/models/cibilreport");
const containerName = "imagecontainer";
const blobService = azureStorage.createBlobService(
  process.env.AZURE_STORAGE_CONNECTION_STRING
);

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

const createCibilReport = catchAsync(async (req, res, next) => {
  const {
    customerName,
    mobileNumber,
    emailId,
    purpose,
    cibilScore,
    status,
    assignedId,
    assignedOn,
    completedOn,
  } = req.body;

  if (!req.files) {
    throw new AppError("Files not uploaded", 400);
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

  const aadhaarFrontUrl = await uploadFile(req.files.aadhaarFront);
  const aadhaarBackUrl = await uploadFile(req.files.aadhaarBack);
  const panCardFrontUrl = await uploadFile(req.files.panCardFront);
  const panCardBackUrl = await uploadFile(req.files.panCardBack);
  const cibilReportUrl = await uploadFile(req.files.cibilReport);

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

  switch (purpose) {
    case "alreadyHaveCibilReport":
      additionalData = {
        cibilScore,
        cibilReport: cibilReportUrl,
      };
      break;

    case "applyForCivilReport":
      additionalData = {
        aadhaarFront: aadhaarFrontUrl,
        aadhaarBack: aadhaarBackUrl,
        panCardFront: panCardFrontUrl,
        panCardBack: panCardBackUrl,
      };
      break;
    default:
      break;
  }

  const cibilReportDetail = cibilReport(purpose);

  const newCibilReport = await cibilReportDetail.create({
    uniqueId,
    customerName,
    mobileNumber,
    emailId,
    purpose,
    ...additionalData,
    status,
    assignedId,
    assignedOn,
    completedOn,
    createdAt: new Date(),
    updatedAt: new Date(),
    // deletedAt: new Date(),
  });

  if (!newCibilReport) {
    return next(new AppError("Cibil Report Creation Failed", 500));
  }
  return res.status(201).json({
    status: "Created",
    data: newCibilReport,
  });
});

const getCibilReports = catchAsync(async (req, res, next) => {
  try {
  const {customerName,mobileNumber} = req.query

  const cibilReports = cibilReport();
  // console.log("15",cibilReports);

  const reports = await cibilReports.findAll({
    where: {
      customerName: customerName, 
      mobileNumber: mobileNumber 
    }
  });
  console.log("12",reports);

  if (reports.length===0) {
    return next(new AppError("No Cibil Reports found", 404));
  }

  return res.status(200).json({ data: reports, count: reports.length });

}catch (error) {
  next(error);
}
});

module.exports = { createCibilReport, getCibilReports };
