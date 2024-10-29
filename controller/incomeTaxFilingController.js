const catchAsync = require("../utils/catchAsync");
const Franchise = require("../db/models/franchise");
const AppError = require("../utils/appError");
const incomeTaxFilingDetails = require("../db/models/incometax");
const wallets = require("../db/models/wallet")
const transationHistory = require("../db/models/transationhistory")

const azureStorage = require("azure-storage");
const intoStream = require("into-stream");

const containerName = "imagecontainer";
const blobService = azureStorage.createBlobService(
  process.env.AZURE_STORAGE_CONNECTION_STRING
);
// };

const uploadBlob = async (file) => {
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
          return reject(err);
        }
        const blobUrl = blobService.getUrl(containerName, blobName);
        resolve(blobUrl);
      }
    );
  });
};

const createIncomeTaxFiling = catchAsync(async (req, res, next) => {
  console.log("Request Body:", req.body);
  console.log("Request Files:", req.files);

  const user = req.user;
  if (!user) {
    return next(new AppError("User not authenticated", 401));
  }

  const franchiseData = await Franchise.findOne({
    where: { email: user.email },
  });
  if (!franchiseData) {
    return next(new AppError("Franchise data not found", 404));
  }

  const uniqueId = franchiseData.franchiseUniqueId;

  const {
    customerName,
    emailId,
    phoneNumber,
    panNumber,
    incomeTaxPassword,
    typeofTransaction,
    gstUsername,
    gstPassword,
    accountName,
    accountNumber,
    ifscCode,
    branchName,
    pfAmount,
    healthInsuranceAmount,
    npsNumber,
    lifeInsuranceAmount,
    rentPaid,
    tuitionFees,
    typeofCapitalGain,
    securities,
    saleDate,
    saleAmount,
    companyName,
    purchaseDate,
    purchaseAmount,
    isinNumber,
    otherDetails,
    status,
  } = req.body;

  const {
    bankStatement,
    businessLoanStatement,
    aadhaarFront,
    aadhaarBack,
    form16,
    housingLoanBankStatement,
    salarySlip,
    electricVehiclePurchase,
    saleDeed,
    purchaseDeed,
  } = req.files || {};

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

  const bankStatementUrl = await uploadFile(bankStatement);
  const saleDeedUrl = await uploadFile(saleDeed);
  const purchaseDeedUrl = await uploadFile(purchaseDeed);
  const businessLoanStatementUrl = await uploadFile(businessLoanStatement);
  const aadhaarFrontUrl = await uploadFile(aadhaarFront);
  const aadhaarBackUrl = await uploadFile(aadhaarBack);
  const form16Url = await uploadFile(form16);
  const housingLoanBankStatementUrl = await uploadFile(
    housingLoanBankStatement
  );
  const salarySlipUrl = await uploadFile(salarySlip);
  const electricVehiclePurchaseUrl = await uploadFile(electricVehiclePurchase);

  const incomeTaxFilingDetail = incomeTaxFilingDetails(
    typeofTransaction,
    typeofCapitalGain,
    securities
  );

  let additionalData = {};

  switch (typeofTransaction) {
    case "business":
      additionalData = {
        gstUsername,
        gstPassword,
        bankStatement: bankStatementUrl,
        businessLoanStatement: businessLoanStatementUrl,
        aadhaarFront: aadhaarFrontUrl,
        aadhaarBack: aadhaarBackUrl,
        accountName,
        accountNumber,
        ifscCode,
        branchName,
      };
      break;

    case "salaried":
      additionalData = {
        form16: form16Url,
        pfAmount,
        healthInsuranceAmount,
        npsNumber,
        lifeInsuranceAmount,
        rentPaid,
        tuitionFees,
        housingLoanBankStatement: housingLoanBankStatementUrl,
        salarySlip: salarySlipUrl,
        electricVehiclePurchase: electricVehiclePurchaseUrl,
      };
      break;

    case "capitalGain":
      additionalData = {
        typeofCapitalGain,
      };

      if (typeofCapitalGain === "property") {
        additionalData = {
          ...additionalData, 
          saleDeed: saleDeedUrl,
          purchaseDeed: purchaseDeedUrl,
        };
      } else if (typeofCapitalGain === "securities") {
        additionalData = {
          ...additionalData, 
          securities,
          saleDate,
          saleAmount,
          companyName,
          purchaseDate,
          purchaseAmount,
          isinNumber,
        };
      }
      break;

    default:
      break;
  }

  console.log(additionalData);
  const newUser = await incomeTaxFilingDetail.create({
    uniqueId,
    customerName,
    emailId,
    phoneNumber,
    panNumber,
    incomeTaxPassword,
    typeofTransaction,
    ...additionalData,
    otherDetails,
    status,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  if (!newUser) {
    return next(new AppError("Income Tax Filing Failed", 500));
  }

  return res.status(200).json({
    status: "success",
    data: newUser,
  });
});

const incometaxUpdate = catchAsync(async (req, res,next) => {
  try {
    const { phoneNumber, status, id, accountNo } = req.body;

    const incomeTaxAcknowledgement = req?.files?.incomeTaxAcknowledgement;
    const computationFile = req?.files?.computationFile;

    if(!req.files){
      return res.status(400).json({ message: "Files not uploaded" });
    }

    const user=req.user


    if (!phoneNumber && !id) {
      return res.status(400).json({ message: "input fields are required" });
    }

    const incomeTaxFilingDetail = incomeTaxFilingDetails();

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

function generateRandomId() {
  const prefix = "DSP";
  const timestamp = Date.now().toString(); 
  return prefix + timestamp;
}

module.exports = {createIncomeTaxFiling, incometaxUpdate};
