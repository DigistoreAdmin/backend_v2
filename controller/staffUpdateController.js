const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const cibilReports = require("../db/models/cibilreport");
const azureStorage = require("azure-storage");
const intoStream = require("into-stream");
const definePancardUser = require("../db/models/pancard");
const azureStorage = require("azure-storage");
const intoStream = require("into-stream");
const AppError = require("../utils/appError");
const gstRegistrationDetails = require("../db/models/gstregistration");
const trainBooking = require("../db/models/trainbooking");
const { Op } = require("sequelize");
const {
  AuthRegistrationsCredentialListMappingListInstance,
} = require("twilio/lib/rest/api/v2010/account/sip/domain/authTypes/authTypeRegistrations/authRegistrationsCredentialListMapping");
const definePassportDetails = require("../db/models/passport");

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


const updateInsuranceDetails = catchAsync(async (req, res) => {
  try {
    const {
      mobileNumber,
      id,
      status,
      companyName,
      throughWhom,
      odPremiumAmount,
      tpPremiumAmount,
      odPoint,
      tpPoint,
      isPaRequired,
      paCoverPoint,
      paCoverAmount,
    } = req.body;

    const policyDocument = req?.files?.policyDocument;

    // Validate required fields

const updateGstDetails = catchAsync(async (req, res) => {
  try {
    const { mobileNumber, status, applicationReferenceNumber, id } = req.body;
    const gstDocument = req?.files?.gstDocument;


const trainBookingUpdate = catchAsync(async (req, res) => {
  try {
    let status="inProgress"
    const {
      id,
      phoneNumber,
      amount

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


    if (!phoneNumber || !id) {
      return res.status(400).json({ message: "Phone number and ID is required" });
    }

    const trainBookingUser = trainBooking;

    const Data = await trainBookingUser.findOne({
      where: { phoneNumber: phoneNumber,id:id },
    });

    if (!Data) {
      return res.status(404).json({ message: "Record not found" });
    }


    if (!phoneNumber) {
      return res.status(400).json({ message: "Mobile number is required" });
    }

    const data = await BusBooking.findOne({
      where: { phoneNumber, id },
    });

    if (!data) {
      return res.status(404).json({ message: "No data found" });
    }


const updatePanDetails = catchAsync(async (req, res) => {
  try {
    const { mobileNumber, status, acknowledgementNumber, reason, ePan } =
      req.body;
    console.log("req.body: ", req.body);
    const acknowledgementFile = req?.files?.acknowledgementFile;



    if (!mobileNumber) {
      return res.status(400).json({ message: "Mobile number is required" });
    }


    const insurance = defineVehicleInsurance();
    const data = await insurance.findOne({ where: { mobileNumber, id } });

    if (!data) {
      return res.status(404).json({ message: "Record not found" });
    }

    // Determine final status
    const finalStatus = status === "completed" ? "completed" : "inProgress";

    // Upload file and handle errors

    const gstDetails = gstRegistrationDetails();

    const data = await gstDetails.findOne({
      where: { customerMobile: mobileNumber, id: id },
    });

    if (!data) {

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

    const acknowledgementFileUrl = await uploadFile(policyDocument);

    // Calculate commission
    let commission = 0;

    if (isPaRequired === "true") {
      commission += (paCoverAmount * paCoverPoint) / 100;
    }

    if (data.insuranceType === "thirdParty") {
      commission += (tpPremiumAmount * tpPoint) / 100;
    } else if (data.insuranceType === "standAlone") {
      commission += (odPremiumAmount * odPoint) / 100;
    } else if (
      data.insuranceType === "bumberToBumber" ||
      data.insuranceType === "fullCover"
    ) {
      commission +=
        (odPremiumAmount * odPoint) / 100 + (tpPremiumAmount * tpPoint) / 100;
    }

    const commissionToFranchise = commission * 0.2;
    const commissionToHeadOffice = commission * 0.8;

    Object.assign(data, {
      status: finalStatus,
      companyName: companyName || data.companyName,
      throughWhom: throughWhom || data.throughWhom,
      commissionToFranchise:
        commissionToFranchise || data.commissionToFranchise,
      commissionToHeadOffice:
        commissionToHeadOffice || data.commissionToHeadOffice,
      acknowledgementFileUrl:
        acknowledgementFileUrl || data.acknowledgementFileUrl,
      odPremiumAmount: odPremiumAmount || data.odPremiumAmount,
      tpPremiumAmount: tpPremiumAmount || data.tpPremiumAmount,
      odPoint: odPoint || data.odPoint,
      tpPoint: tpPoint || data.tpPoint,
      paCoverPoint: paCoverPoint || data.paCoverPoint,
      paCoverAmount: paCoverAmount || data.paCoverAmount,
    });


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
   
    let totalAmount=(parseInt(amount) + serviceCharge)

    Data.workId = workId || Data.workId;
    Data.status="completed"
    Data.ticket = ticketUrl || Data.ticket;
    Data.amount=amount || Data.amount
    Data.serviceCharge=serviceCharge || Data.serviceCharge
    Data.commissionToFranchise=commissionToFranchise || Data.commissionToFranchise
    Data.commissionToHeadOffice=commissionToHeadOffice || Data.commissionToHeadOffice
    Data.totalAmount=totalAmount || Data.totalAmount
   

    await Data.save();

    return res.status(200).json({
      message: `success`,
      Data,

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
      message: "Success",
      data,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "An error occurred",
      error: error.message,
    });
  }
});


      message: `success`,
      data,
      message: "success",
      data,

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



module.exports = { loanStatus, updatePanDetails, passportUpdate, updateInsuranceDetails };


