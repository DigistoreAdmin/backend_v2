const catchAsync = require("../utils/catchAsync");
const cibilReports = require("../db/models/cibilreport");
const definePancardUser = require("../db/models/pancard");
const azureStorage = require("azure-storage");
const intoStream = require("into-stream");
const AppError = require("../utils/appError");
const {
  AuthRegistrationsCredentialListMappingListInstance,
} = require("twilio/lib/rest/api/v2010/account/sip/domain/authTypes/authTypeRegistrations/authRegistrationsCredentialListMapping");
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

const updatePanDetails = catchAsync(async (req, res) => {
  try {
    const { mobileNumber, status, acknowledgementNumber, reason, ePan } =
      req.body;
    console.log("req.body: ", req.body);
    const acknowledgementFile = req?.files?.acknowledgementFile;

    if (!mobileNumber) {
      return res.status(400).json({ message: "Mobile number is required" });
    }

    const pancardUser = definePancardUser();

    const report = await pancardUser.findOne({
      where: { mobileNumber: mobileNumber },
    });

    if (!report) {
      return res.status(404).json({ message: "Record not found" });
    }

    const finalStatus = status === "completed" ? "completed" : "inProgress";

    const uploadFile = async (file) => {
      if (file) {
        try {
          return await uploadBlob(file);
        } catch (error) {
          console.error(`Error uploading file ${file.name}:`, error);
          throw new Error("File upload failed");
        }
      }
      return null;
    };

    const acknowledgementFileUrl = await uploadFile(acknowledgementFile);

    report.status = finalStatus;
    report.acknowledgementFile =
      acknowledgementFileUrl || report.acknowledgementFile;
    report.acknowledgementNumber =
      acknowledgementNumber || report.acknowledgementNumber;
    report.reason = reason || report.reason;
    report.ePan = ePan || report.ePan;

    await report.save();

    return res.status(200).json({
      message: `success`,
      report,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "An error occurred", error: error.message });
  }
});

module.exports = { loanStatus, updatePanDetails };
