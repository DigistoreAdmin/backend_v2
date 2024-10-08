const catchAsync = require("../utils/catchAsync");
const cibilReports = require("../db/models/cibilreport");
const azureStorage = require("azure-storage");
const intoStream = require("into-stream");
const AppError = require("../utils/appError");
const gstRegistrationDetails = require("../db/models/gstregistration");
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

    const data = await cibilReportDetail.findOne({
      where: {
        customerName: customerName,
        mobileNumber: mobileNumber,
      },
    });

    if (!data) {
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

      data.status = status;
      data.cibilReport = cibilReportUrl;
      data.cibilScore = cibilScore;

      await data.save();

      res.status(200).json({
        message: "Status, CIBIL Report, and CIBIL Score updated successfully",
        data,
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

const updateGstDetails = catchAsync(async (req, res) => {
  try {
    const { mobileNumber, status, applicationReferenceNumber, id } = req.body;
    const gstDocument = req?.files?.gstDocument;

    if (!mobileNumber) {
      return res.status(400).json({ message: "Mobile number is required" });
    }

    const gstDetails = gstRegistrationDetails();

    const data = await gstDetails.findOne({
      where: { customerMobile: mobileNumber, id: id },
    });

    if (!data) {
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

    const gstDocumentUrl = await uploadFile(gstDocument);

    let totalAmount = 1500;
    let commissionToHeadOffice = 1000;
    let commissionToFranchise = 500;

    data.status = finalStatus;
    data.gstDocument = gstDocumentUrl || data.gstDocument;
    data.applicationReferenceNumber =
      applicationReferenceNumber || data.applicationReferenceNumber;

    data.totalAmount = totalAmount || data.totalAmount;
    data.commissionToHeadOffice =
      commissionToHeadOffice || data.commissionToHeadOffice;

    data.commissionToFranchise =
      commissionToFranchise || data.commissionToFranchise;

    await data.save();

    return res.status(200).json({
      message: `success`,
      data,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "An error occurred", error: error.message });
  }
});

module.exports = { loanStatus, updateGstDetails };
