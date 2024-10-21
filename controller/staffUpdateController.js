const catchAsync = require("../utils/catchAsync");
const definePancardUser = require("../db/models/pancard");
const cibilReports = require("../db/models/cibilreport");
const defineIncomeTax = require("../db/models/incometax")
const defineVehicleInsurance = require("../db/models/vehicleInsurance");
const gstRegistrationDetails = require("../db/models/gstregistration");
const azureStorage = require("azure-storage");
const intoStream = require("into-stream");
const AppError = require("../utils/appError");
const trainbooking = require("../db/models/trainbooking");
const transationHistory = require("../db/models/transationhistory");
const { Op } = require("sequelize");
const containerName = "imagecontainer";
const blobService = azureStorage.createBlobService(
  process.env.AZURE_STORAGE_CONNECTION_STRING
);
const BusBooking = require('../db/models/busbooking');
const Franchise = require("../db/models/franchise");
const wallets = require("../db/models/wallet");

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

const trainBookingUpdate = catchAsync(async (req, res,next) => {
  try {
    const {
      id,
      phoneNumber,
      status,
      amount,
      accountNo,
    } = req.body;

    console.log("req.body: ", req.body);

    const user=req.user

    const ticket = req?.files?.ticket;

    if (!phoneNumber) {
      return res.status(400).json({ message: "Mobile number is required" });
    }

 const franchiseData = await Franchise.findOne({
    where: { email: user.email },
  });

  if (!franchiseData) return next(new AppError("Franchise not found", 404));

  const walletData = await wallets.findOne({
    where: { uniqueId: franchiseData.franchiseUniqueId },
  });

  if (!walletData) return next(new AppError("Wallet not found", 404));


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
    
    let totalAmount=parseInt(amount) + serviceCharge

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


  if(totalAmount > walletData.balance){
    return next(new AppError("Insufficient wallet balance", 401));
    }

  await report.save();

   const newBalance =Math.round(walletData.balance-totalAmount)

  // Update wallet balance
  const updated = await wallets.update(
    { balance: newBalance },
    { where: { uniqueId: franchiseData.franchiseUniqueId } }
  );
  
  
  const transactionId=generateRandomId()

  const newTransactionHistory = await transationHistory.create({
    transactionId: transactionId,
    uniqueId: franchiseData.franchiseUniqueId,
    userName: franchiseData.franchiseName,
    userType: user.userType,
    service: "trainBooking",
    customerNumber: phoneNumber,
    serviceNumber: accountNo,
    serviceProvider: "trainBooking",
    status: "success",
    amount: totalAmount,
    franchiseCommission: commissionToFranchise,
    adminCommission: commissionToHeadOffice,
    walletBalance: newBalance,
  });

  if (newTransactionHistory && updated) {
    return res.status(200).json({
      message: "success",
      report,
    });
  }

  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "An error occurred", error: error.message });
  }
});

const updatePanDetails = catchAsync(async (req, res,next) => {
  try {
    const { mobileNumber,id,status, acknowledgementNumber, reason, ePan,accountNo } =
      req.body;
    console.log("req.body: ", req.body);
    const acknowledgementFile = req?.files?.acknowledgementFile;

    const user=req.user


    if (!mobileNumber) {
      return res.status(400).json({ message: "Mobile number is required" });
    }

    const pancardUser = definePancardUser();

    const report = await pancardUser.findOne({
      where: { mobileNumber: mobileNumber ,id:id},
    });

    if (!report) {
      return res.status(404).json({ message: "Record not found" });
    }

    const franchiseData = await Franchise.findOne({
      where: { email: user.email },
    });
    
    if (!franchiseData) return next(new AppError("Franchise not found", 404));
    
    
    const walletData = await wallets.findOne({
      where: { uniqueId: franchiseData.franchiseUniqueId },
    });
    
    if (!walletData) return next(new AppError("Wallet not found", 404));
    

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

    
    let totalAmount = 1500;
    let commissionToHeadOffice = 1000;
    let commissionToFranchise = 500;

    report.status = finalStatus;
    report.acknowledgementFile =
      acknowledgementFileUrl || report.acknowledgementFile;
    report.acknowledgementNumber =
      acknowledgementNumber || report.acknowledgementNumber;
    report.reason = reason || report.reason;
    report.ePan = ePan || report.ePan;
    
    report.totalAmount = totalAmount || report.totalAmount;
    report.commissionToHeadOffice =
      commissionToHeadOffice || report.commissionToHeadOffice;

      report.commissionToFranchise =
      commissionToFranchise || report.commissionToFranchise;

  
      if(totalAmount > walletData.balance){
        return next(new AppError("Insufficient wallet balance", 401));
        }
  
      await report.save();
  
      const newBalance =Math.round(walletData.balance-totalAmount)
  
      
      // Update wallet balance
      const updated = await wallets.update(
        { balance: newBalance },
        { where: { uniqueId: franchiseData.franchiseUniqueId } }
      );
  
      const transactionId=generateRandomId()
  
    const newTransactionHistory = await transationHistory.create({
        transactionId: transactionId,
        uniqueId: franchiseData.franchiseUniqueId,
        userName: franchiseData.franchiseName,
        userType: user.userType,
        service: "pancard",
        customerNumber: mobileNumber,
        serviceNumber: accountNo,
        serviceProvider: "pancard",
        status: "success",
        amount: totalAmount,
        franchiseCommission: commissionToFranchise,
        adminCommission: commissionToHeadOffice,
        walletBalance: newBalance,
      });
  
    if (newTransactionHistory && updated) {
    return res.status(200).json({
      message: `success`,
      report,
    });
  }
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "An error occurred", error: error.message });
  }
});

const updateGstDetails = catchAsync(async (req, res,next) => {
  try {
    const { mobileNumber, status, applicationReferenceNumber, id ,accountNo} = req.body;
    const gstDocument = req?.files?.gstDocument;

    if (!mobileNumber) {
      return res.status(400).json({ message: "Mobile number is required" });
    }

    const user=req.user

    const gstDetails = gstRegistrationDetails();

    const data = await gstDetails.findOne({
      where: { customerMobile: mobileNumber, id: id },
    });

    if (!data) {
      return res.status(404).json({ message: "Record not found" });
    }

    const franchiseData = await Franchise.findOne({
      where: { email: user.email },
    });
    
    if (!franchiseData) return next(new AppError("Franchise not found", 404));
    
    
    const walletData = await wallets.findOne({
      where: { uniqueId: franchiseData.franchiseUniqueId },
    });
    
    if (!walletData) return next(new AppError("Wallet not found", 404));
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

      if(totalAmount > walletData.balance){
        return next(new AppError("Insufficient wallet balance", 401));
        }
  
      await data.save();
  
      const newBalance =Math.round(walletData.balance-totalAmount)
  
      const updated = await wallets.update(
        { balance: newBalance },
        { where: { uniqueId: franchiseData.franchiseUniqueId } }
      );
  
      const transactionId=generateRandomId()
  
      const newTransactionHistory = await transationHistory.create({
        transactionId: transactionId,
        uniqueId: franchiseData.franchiseUniqueId,
        userName: franchiseData.franchiseName,
        userType: user.userType,
        service: "gst",
        customerNumber: mobileNumber,
        serviceNumber: accountNo,
        serviceProvider: "gst",
        status: "success",
        amount: totalAmount,
        franchiseCommission: commissionToFranchise,
        adminCommission: commissionToHeadOffice,
        walletBalance: newBalance,
      });
  
    if (newTransactionHistory && updated) {
    return res.status(200).json({
      message: `success`,
      data,
    });
  }
  } catch (error) {
    console.error(error);
    return res
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

const incometaxUpdate = catchAsync(async (req, res,next) => {
  try {
    const { phoneNumber, status, id,accountNo } = req.body;

    const incomeTaxAcknowledgement = req?.files?.incomeTaxAcknowledgement;
    const computationFile = req?.files?.computationFile;

    if(!req.files){
      return res.status(400).json({ message: "Files not uploaded" });
    }

    const user=req.user


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

    const franchiseData = await Franchise.findOne({
      where: { email: user.email },
    });
    
    if (!franchiseData) return next(new AppError("Franchise not found", 404));
    
    
    const walletData = await wallets.findOne({
      where: { uniqueId: franchiseData.franchiseUniqueId },
    });
    
    if (!walletData) return next(new AppError("Wallet not found", 404));

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

    
    if(totalAmount > walletData.balance){
      return next(new AppError("Insufficient wallet balance", 401));
      }

    await data.save();

    const newBalance =Math.round(walletData.balance-totalAmount)

    const updated = await wallets.update(
      { balance: newBalance },
      { where: { uniqueId: franchiseData.franchiseUniqueId } }
    );

    const transactionId=generateRandomId()

    const newTransactionHistory = await transationHistory.create({
      transactionId: transactionId,
      uniqueId: franchiseData.franchiseUniqueId,
      userName: franchiseData.franchiseName,
      userType: user.userType,
      service: "incomeTax",
      customerNumber: phoneNumber,
      serviceNumber: accountNo,
      serviceProvider: "incomeTax",
      status: "success",
      amount: totalAmount,
      franchiseCommission: franchiseCommission,
      adminCommission: HOCommission,
      walletBalance: newBalance,
    });

    if (newTransactionHistory && updated) {
      return res.status(200).json({
        message: "success",
        data,
      });
      }
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "An error occurred error", error: error.message });
  }
});

const updateBusBooking = catchAsync(async (req, res,next) => {
  try {
    let status = "inProgress"
    const {
      id,
      phoneNumber,
      amount,
      accountNo,
    } = req.body;
    console.log("req.body: ", req.body);
    const ticket = req?.files?.ticket;

    const user=req.user

    if (!phoneNumber) {
      return res.status(400).json({ message: "Mobile number is required" });
    }

    const data = await BusBooking.findOne({
      where: { phoneNumber, id },
    });


    if (!data) {
      return res.status(404).json({ message: "No data found" });
    }

    const franchiseData = await Franchise.findOne({
      where: { email: user.email },
    });
    
    if (!franchiseData) return next(new AppError("Franchise not found", 404));
    
    
    const walletData = await wallets.findOne({
      where: { uniqueId: franchiseData.franchiseUniqueId },
    });
    
    if (!walletData) return next(new AppError("Wallet not found", 404));
    

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
    let commissionToHO = 0

    if (amount > 100) {
      serviceCharge = 100
      commissionToFranchise = 30
      commissionToHO = 70
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


    if(totalAmount > walletData.balance){
      return next(new AppError("Insufficient wallet balance", 401));
      }

    await data.save();

    const newBalance =Math.round(walletData.balance-totalAmount)

    
    // Update wallet balance
    const updated = await wallets.update(
      { balance: newBalance },
      { where: { uniqueId: franchiseData.franchiseUniqueId } }
    );

    const transactionId=generateRandomId()

    const newTransactionHistory = await transationHistory.create({
      transactionId: transactionId,
      uniqueId: franchiseData.franchiseUniqueId,
      userName: franchiseData.franchiseName,
      userType: user.userType,
      service: "busBooking",
      customerNumber: phoneNumber,
      serviceNumber: accountNo,
      serviceProvider: "busBooking",
      status: "success",
      amount: totalAmount,
      franchiseCommission: commissionToFranchise,
      adminCommission: commissionToHO,
      walletBalance: newBalance,
    });

    if (newTransactionHistory && updated) {
    return res.status(200).json({
      message: "success",
      data,
    });
    }

  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "An error occurred", error: error.message });
  }
});

function generateRandomId() {
  const prefix = "DSP";
  const timestamp = Date.now().toString(); 
  return prefix + timestamp;
}

module.exports = { loanStatus, trainBookingUpdate, updatePanDetails,updateGstDetails,updateInsuranceDetails,incometaxUpdate,updateBusBooking };
