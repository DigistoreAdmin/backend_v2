const catchAsync = require("../utils/catchAsync");
const Franchise = require("../db/models/franchise");
const AppError = require("../utils/appError");
const incomeTaxFilingDetails = require("../db/models/incometax");

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

module.exports = createIncomeTaxFiling;
