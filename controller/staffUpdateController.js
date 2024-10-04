const catchAsync = require("../utils/catchAsync");
const cibilReports = require("../db/models/cibilreport");
const azureStorage = require("azure-storage");
const intoStream = require("into-stream");
const AppError = require("../utils/appError");
const containerName = "imagecontainer";
const blobService = azureStorage.createBlobService(
  process.env.AZURE_STORAGE_CONNECTION_STRING
);
const BusBooking = require('../db/models/busbooking');
const { Op } = require('sequelize');


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

    }
    else {

      res.status(400).json({ message: "Invalid status value" });

    }
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "An error occurred", error: error.message });
  }
});

const updateBusBooking = catchAsync(async (req, res) => {
  try {
    let status = "inProgress"
    const {
      id,
      phoneNumber,
      amount,
    } = req.body;
    console.log("req.body: ", req.body);
    const ticket = req?.files?.ticket;

    if (!phoneNumber) {
      return res.status(400).json({ message: "Mobile number is required" });
    }

    const data = await BusBooking.findOne({
      where: { phoneNumber, id },
    });

    if (!data) {
      return res.status(404).json({ message: "No data found" });
    }

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

    const currentDate = new Date()
      .toISOString()
      .slice(0, 10)
      .split("-")
      .reverse()
      .join("");
    const count = await BusBooking.count({
      where: {
        workId: {
          [Op.like]: `${currentDate}BTB%`,
        },
      },
    });
    const workId = `${currentDate}BTB${(count + 1)
      .toString()
      .padStart(3, "0")}`;

    const ticketUrl = await uploadFile(ticket);

    let serviceCharge = 0
    let commissionToFranchise = 0
    let commissionToHeadOffice = 0

    if (amount > 100) {
      serviceCharge = 100
      commissionToFranchise = 30
      commissionToHeadOffice = 70
    } else {
      serviceCharge = 50
      commissionToFranchise = 20
      commissionToHO = 30
    }

    let totalAmount = parseInt(amount) + serviceCharge
    status = "completed"
    data.workId = workId || data.workId;
    data.status = status;
    data.ticket = ticketUrl || data.ticket;
    data.amount = amount || data.amount
    data.serviceCharge = serviceCharge || data.serviceCharge
    data.commissionToFranchise = commissionToFranchise || data.commissionToFranchise
    data.commissionToHO = commissionToHO || data.commissionToHO
    data.totalAmount = totalAmount || data.totalAmount

    await data.save();

    return res.status(200).json({
      message: "success",
      data,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "An error occurred", error: error.message });
  }
});

module.exports = { loanStatus, updateBusBooking };
