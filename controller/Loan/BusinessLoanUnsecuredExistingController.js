const Franchise = require("../../db/models/franchise");
const defineBusinessLoanUnscuredExisting = require("../../db/models/BusinessLoanUnsecuredExisting");
const catchAsync = require("../../utils/catchAsync");

const azureStorage = require("azure-storage");
const intoStream = require("into-stream");

const containerName = "imagecontainer";
const blobService = azureStorage.createBlobService(
  process.env.AZURE_STORAGE_CONNECTION_STRING
);

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

const uploadFile = async (file) => (file ? await uploadBlob(file) : null);



const createBusinessLoanUnsecuredExisting = catchAsync(async (req, res) => {

  try {

    console.log(req.files);

    const {

      loanAmount,
      cibil,
      cibilScore,
      customerName,
      phoneNumber,
      email,
      status,
      assignedId,
      assignedOn,
      completedOn,

    } = req.body;

    const {

      cibilReport,
      sourceOfIncome,
      cibilAcknowledgement,
      InvoiceCopyOfAssetsToPurchase,
      BalanceSheetAndPl2Years,
      BankStatement1Year,
      RentAgreement,
      LicenceCopy,
      otherDocuments,
      GSTDetails

    } = req.files;

    if (!req.files) {
      throw new AppError("Files not uploaded", 400);
    }
  
    const InvoiceCopyOfAssetsToPurchaseUrl = await uploadFile(InvoiceCopyOfAssetsToPurchase);
    const BalanceSheetAndPl2YearsUrl = await uploadFile(BalanceSheetAndPl2Years);
    const BankStatement1YearUrl = await uploadFile(BankStatement1Year);
    const RentAgreementUrl = await uploadFile(RentAgreement);
    const LicenceCopyUrl = await uploadFile(LicenceCopy);
    const GSTDetailsUrl = await uploadFile(GSTDetails);

    const uploadMultipleFiles = async (files) => {
     
      if (!files) return [];
      
      // Ensure files is an array
      files = Array.isArray(files) ? files : [files];
      console.log("object Files", files);
      const uploadPromises = files.map((file) => uploadFile(file));
      return Promise.all(uploadPromises);
    };

    const otherDocumentsUrl = await uploadMultipleFiles(otherDocuments);

    const cibilReportUrl = await uploadFile(cibilReport);
    const cibilAcknowledgementUrl = await uploadFile(cibilAcknowledgement);
    const sourceOfIncomeUrl = await uploadFile(sourceOfIncome);

    const user = req.user;
    if (!user) {
      return next(new AppError("User not found", 401));
    }
    const franchise = await Franchise.findOne({
      where: { email: user.email },
    });
    const uniqueId = franchise.franchiseUniqueId;
    if (!uniqueId) {
      return next(new AppError("Missing unique id for the franchise", 400));
    }

    const BusinessLoan = defineBusinessLoanUnscuredExisting(cibil);
    let workID = "";

    const newBusinessLoan = await BusinessLoan.create({
      uniqueId: uniqueId,
      workID,
      customerName,
      phoneNumber,
      email,
      InvoiceCopyOfAssetsToPurchase:InvoiceCopyOfAssetsToPurchaseUrl,
      BalanceSheetAndPl2Years:BalanceSheetAndPl2YearsUrl,
      BankStatement1Year:BankStatement1YearUrl,
      RentAgreement:RentAgreementUrl,
      LicenceCopy:LicenceCopyUrl,
      otherDocuments:otherDocumentsUrl,
      GSTDetails:GSTDetailsUrl,
      cibil,
      cibilScore,
      cibilAcknowledgement: cibilAcknowledgementUrl,
      cibilReport: cibilReportUrl,
      loanAmount,
      sourceOfIncome: sourceOfIncomeUrl,
      status,
      assignedId,
      assignedOn,
      completedOn,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    console.log(newBusinessLoan);

    res.status(201).json({ newBusinessLoan });

  } catch (error) {
    console.error("Error creating Business Loan - Unsecured Existing:", error);
    res.status(500).json({ error: "Failed to create Business Loan - Unsecured Existing" });
  }
});

module.exports = { createBusinessLoanUnsecuredExisting };