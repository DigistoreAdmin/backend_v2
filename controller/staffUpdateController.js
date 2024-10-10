const catchAsync = require("../utils/catchAsync");
const cibilReports = require("../db/models/cibilreport");
const azureStorage = require("azure-storage");
const intoStream = require("into-stream");
const AppError = require("../utils/appError");
const definePassportDetails = require("../db/models/passport");
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

const loanStatus = catchAsync(async (req, res) => {
  try {
    const { customerName, mobileNumber, status, cibilScore } = req.body;
    const { cibilReport } = req.files;

    if (!req.files) {
      throw new AppError("Files not uploaded", 400);
    }

    console.log("body:", req.body);
    console.log("files:", req.files);

    if (!customerName && !mobileNumber) {
      return res.status(404).json({ message: "Missing required fields" });
    }

    const cibilReportDetail = cibilReports();

    const report = await cibilReportDetail.findOne({
      where: {
        customerName: customerName,
        mobileNumber: mobileNumber,
      },
    });

    if (!report) {
      return res.status(404).json({ message: "Record not found" });
    }

    if (status === "approve" || status === "reject") {
      const uploadFile = async (file) => {
        if (file) {
          try {
            return await uploadBlob(file);
          } catch (error) {
            console.error(`Error uploading file ${file.name}:`, error);
            return null;
          }
        }
      };

      const cibilReportUrl = await uploadFile(cibilReport);

      report.status = status;
      report.cibilReport = cibilReportUrl;
      report.cibilScore = cibilScore;

      await report.save();

      res.status(200).json({
        message: "Status, CIBIL Report, and CIBIL Score updated successfully",
        report,
      });
    } else {
      res.status(400).json({ message: "Invalid status value" });
    }
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "An error occurred", error: error.message });
  }
});

const passportUpdate = catchAsync(async (req, res) => {
  try {
    const { mobileNumber, passportAppointmentDate, username, password } =
      req.body;
    const { passportFile } = req.files;

    // if (!req.files) {
    //   throw new AppError("Files not uploaded", 400);
    // }

    console.log("body:", req.body);
    console.log("files:", req.files);

    // Check for required fields
    if (!mobileNumber) {
      return res
        .status(404)
        .json({ message: "Missing required field: mobileNumber" });
    }

    // Define passport model
    const passportDetails = definePassportDetails();

    // Find the passport record by mobile number
    const passportRecord = await passportDetails.findOne({
      where: { mobileNumber },
    });

    if (!passportRecord) {
      return res.status(404).json({ message: "Passport record not found" });
    }

    // Helper function to upload files (similar to loanStatus)
    const uploadFile = async (file) => {
      if (file) {
        try {
          return await uploadBlob(file);
        } catch (error) {
          console.error(`Error uploading file ${file.name}:`, error);
          return null;
        }
      }
    };

    const passportFileUrl = await uploadFile(passportFile);

    passportAppointmentDate
      ? (passportRecord.passportAppointmentDate = passportAppointmentDate)
      : null;

    username ? (passportRecord.username = username) : null;
    password ? (passportRecord.password = password) : null;
    passportFileUrl ? (passportRecord.passportFile = passportFileUrl) : null;

    await passportRecord.save();

    res.status(200).json({
      message: "Passport details updated successfully",
      passportRecord,
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "An error occurred", error: error.message });
  }
});

module.exports = { loanStatus, passportUpdate };
