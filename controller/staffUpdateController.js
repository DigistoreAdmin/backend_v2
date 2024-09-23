const catchAsync = require("../utils/catchAsync");
const cibilReports = require("../db/models/cibilreport");
const BusBooking = require("../db/models/busbooking");
const trainBooking = require("../db/models/trainbooking");

const azureStorage = require("azure-storage");
const intoStream = require("into-stream");
const AppError = require("../utils/appError");
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

const trainStatus = catchAsync(async (req, res, next) => {
  try {
    const { email, phoneNumber, status } = req.body;

    const findPerson = await trainBooking.findOne({
      where: { email: email, phoneNumber: phoneNumber },
    });

    if (!findPerson) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    console.log("object", findPerson);

    const updateStatus = await trainBooking.update(
      {
        status,
      },
      {
        where: {
          email: findPerson.email,
          phoneNumber: findPerson.phoneNumber,
        },
      }
    );

    if (!updateStatus) {
      return res.status(400).json({ message: "Failed to update status" });
    }

    const updatedPerson = await trainBooking.findOne({
      where: {
        email: findPerson.email,
        phoneNumber: findPerson.phoneNumber,
      },
    });

    res.status(200).json({
      message: "Status updated successfully",
      updateStatus: updatedPerson,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "An error occured", error: error.message });
  }
});

const busStatus = catchAsync(async (req, res, next) => {
  try {
    const { email, phoneNumber, status } = req.body;

    const findPerson = await BusBooking.findOne({
      where: { email: email, phoneNumber: phoneNumber },
    });

    if (!findPerson) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    console.log("object", findPerson);

    const updateStatus = await BusBooking.update(
      {
        status,
      },
      {
        where: {
          email: findPerson.email,
          phoneNumber: findPerson.phoneNumber,
        },
      }
    );

    if (!updateStatus) {
      return res.status(400).json({ message: "Failed to update status" });
    }

    const updatedPerson = await BusBooking.findOne({
      where: {
        email: findPerson.email,
        phoneNumber: findPerson.phoneNumber,
      },
    });

    res.status(200).json({
      message: "Status updated successfully",
      updateStatus: updatedPerson,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "An error occured", error: error.message });
  }
});

module.exports = { loanStatus, trainStatus, busStatus };
