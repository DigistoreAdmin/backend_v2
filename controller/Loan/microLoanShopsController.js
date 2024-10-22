const catchAsync = require("../../utils/catchAsync");
const microLoanShop = require("../../db/models/microloansshop");
const Franchise = require("../../db/models/franchise");
const azureStorage = require("azure-storage");
const intoStream = require("into-stream");
const { Op } = require("sequelize");

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

const createMicroLoanShops = catchAsync(async (req, res) => {
  try {
    console.log(req.files);
    console.log(req.body);
    const {
      customerName,
      mobileNumber,
      shopName,
      shopType,
      loanAmount,
      emiAmount,
      staffStatus,
      collectionPoint,
      collectionDate,
      collectionMethod,
      tenure,
      loanProcessedBy,
      commissionDetails,
      commissionCredit,
      assignedId,
      assignedOn,
      completedOn,
      status,
    } = req.body;

    const {
      otherDocuments,
      bankStatement,
      aadhaarFront,
      aadhaarBack,
      pan,
      shopPhoto,
    } = req.files;
    const firstYear = req.files[`firstYear`];
    const secondYear = req.files[`secondYear`];
    if (!req.files) {
      throw new AppError("Files not uploaded", 400);
    }

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
    const aadhaarFrontUrl = await uploadFile(aadhaarFront);
    const aadhaarBackUrl = await uploadFile(aadhaarBack);
    const panUrl = await uploadFile(pan);
    const otherDocumentsUrl = await uploadFile(otherDocuments);
    const shopPhotoUrl = await uploadFile(shopPhoto);
    const firstYearUrl = await uploadFile(firstYear);
    const secondYearUrl = await uploadFile(secondYear);

    licenceData = {
      firstYear: firstYearUrl,
      secondYear: secondYearUrl,
    };

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

    const currentDate = new Date()
      .toISOString()
      .slice(0, 10)
      .split("-")
      .reverse()
      .join("");

    const count = await microLoanShop.count({
      where: {
        workId: {
          [Op.like]: `${currentDate}MLS%`,
        },
      },
    });
    const workId = `${currentDate}MLS${(count + 1)
      .toString()
      .padStart(3, "0")}`;

      const microLoanShopData = await microLoanShop.create({
        uniqueId,
        workId,
        customerName,
        mobileNumber,
        shopName,
        shopType,
        loanAmount,
        aadhaarFront: aadhaarFrontUrl,
        aadhaarBack: aadhaarBackUrl,
        bankStatement: bankStatementUrl,
        pan: panUrl,
        twoYearLicence: licenceData, 
        shopPhoto: shopPhotoUrl,
        otherDocuments: otherDocumentsUrl,
        staffStatus,
        emiAmount,
        collectionPoint,
        collectionDate,
        collectionMethod,
        tenure,
        loanProcessedBy,
        commissionDetails,
        commissionCredit,
        assignedId,
        assignedOn,
        completedOn,
        status,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

    console.log(microLoanShopData);
    res.status(201).json({ microLoanShopData });
  } catch (error) {
    console.error("Error creating Micro Loan Shops :", error);
    res.status(500).json({ error: "Failed to create Micro Loan Shops " });
  }
});
module.exports = { createMicroLoanShops };
