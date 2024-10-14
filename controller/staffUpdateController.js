const catchAsync = require("../utils/catchAsync");
const definePancardUser = require("../db/models/pancard");
const cibilReports = require("../db/models/cibilreport");
const defineIncomeTax = require("../db/models/incometax")

const azureStorage = require("azure-storage");
const intoStream = require("into-stream");
const AppError = require("../utils/appError");
const trainbooking = require("../db/models/trainbooking");
const { Op } = require("sequelize");
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

const trainBookingUpdate = catchAsync(async (req, res) => {
  try {
    const {
      id,
      phoneNumber,
      status,
      amount
    } = req.body;
    console.log("req.body: ", req.body);
    const ticket = req?.files?.ticket;

    if (!phoneNumber) {
      return res.status(400).json({ message: "Mobile number is required" });
    }

    const trainBookingUser = trainbooking;

    const report = await trainBookingUser.findOne({
      where: { phoneNumber: phoneNumber,id:id },
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

    const currentDate = new Date()
      .toISOString()
      .slice(0, 10)
      .split("-")
      .reverse()
      .join("");
    const count = await trainBookingUser.count({
      where: {
        workId: {
          [Op.like]: `${currentDate}TTB%`,
        },
      },
    });
    const workId = `${currentDate}TTB${(count + 1)
      .toString()
      .padStart(3, "0")}`;

    const ticketUrl = await uploadFile(ticket);

    let serviceCharge=0
    let commissionToFranchise=0
    let commissionToHeadOffice=0
    
    if(amount>100){
      serviceCharge=100
      commissionToFranchise=30
      commissionToHeadOffice=70
    }else{
      serviceCharge=50
      commissionToFranchise=20
      commissionToHeadOffice=30
    }
    
    let totalAmount=amount + serviceCharge

    report.workId = workId || report.workId;
    report.status = finalStatus;
    report.ticket = ticketUrl || report.ticket;
    report.amount = amount || report.amount;
    report.serviceCharge = serviceCharge || report.serviceCharge;
    report.commissionToFranchise =
      commissionToFranchise || report.commissionToFranchise;
    report.commissionToHeadOffice =
      commissionToHeadOffice || report.commissionToHeadOffice;
    report.totalAmount = totalAmount || report.totalAmount;

    await report.save();

    return res.status(200).json({
      message: "success",
      report,
    });
  } catch (error) {
    console.error(error);
    return res
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

const incometaxUpdate = catchAsync(async (req, res) => {
  try {
    const { phoneNumber, status, id } = req.body;

    const incomeTaxAcknowledgement = req?.files?.incomeTaxAcknowledgement;
    const computationFile = req?.files?.computationFile;

    if(!req.files){
      return res.status(400).json({ message: "Files not uploaded" });
    }

    if (!phoneNumber && !id) {
      return res.status(400).json({ message: "input fields are required" });
    }

    const incomeTaxFilingDetail = defineIncomeTax();

    const data = await incomeTaxFilingDetail.findOne({
      where: {
        phoneNumber: phoneNumber,
        id: id,
      },
    });

    if (!data) {
      return res.status(404).json({
        message: "Record not found",
      });
    }

    const uploadFile = async (file) => {
      if (file) {
        try {
          return await uploadBlob(file);
        } catch (error) {
          console.error(Error`uploading file ${file.name}:`, error);
          throw new Error("File upload failed");
        }
      }
      return null;
    };

    if (data.typeofTransaction === "salaried"){
      console.log("Transaction", data.typeofTransaction)
      totalAmount = 500;
      franchiseCommission = 100;
      HOCommission = 400;
    }

    if(data.typeofTransaction === "business"){
      totalAmount = 5000;
      franchiseCommission = 1000;
      HOCommission = 4000;
    }
    else if(data.typeofTransaction === "capitalGain"){
      totalAmount = 5000;
      franchiseCommission = 1000;
      HOCommission = 4000;
    }

    if(data.typeofTransaction === "other"){
      totalAmount = 1500;
      franchiseCommission = 300;
      HOCommission = 1200;
    }

    const incomeTaxAcknowledgementUrl = await uploadFile(
      incomeTaxAcknowledgement
    );
    const computationFileUrl = await uploadFile(computationFile);

    const finalStatus = status === "completed" ? "completed" : "inProgress";

    data.status = finalStatus;
    data.franchiseCommission = franchiseCommission || data.franchiseCommission;
    data.HOCommission = HOCommission || data.HOCommission;
    data.totalAmount = totalAmount || data.totalAmount;
    data.incomeTaxAcknowledgement = incomeTaxAcknowledgementUrl || data.incomeTaxAcknowledgement;
    data.computationFile = computationFileUrl || data.computationFile;

    await data.save();

    return res.status(200).json({
      message: "Success",
      data,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "An error occurred error", error: error.message });
  }
});

module.exports = { loanStatus, trainBookingUpdate, updatePanDetails, incometaxUpdate  };
