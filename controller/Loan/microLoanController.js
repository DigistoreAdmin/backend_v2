const catchAsync = require("../../utils/catchAsync");
const microLoans = require("../../db/models/microloan");
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

const createMicroLoan = catchAsync(async (req, res) => {
  try {
    console.log(req.files);

    const {
      customerName,
      phoneNumber,
      address,
      pinCode,
      income,
      loanAmount,
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
    } = req.body;

    const { otherDocuments, bankStatement, aadhaarFront, aadhaarBack, panPic } =
      req.files;

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
    const panUrl = await uploadFile(panPic);
    const otherDocumentsUrl = await uploadFile(otherDocuments);

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

    const count = await microLoans.count({
      where: {
        workId: {
          [Op.like]: `${currentDate}ML%`,
        },
      },
    });
    const workId = `${currentDate}ML${(count + 1).toString().padStart(3, "0")}`;

    const microloanData = await microLoans.create({
      uniqueId,
      workId,
      customerName,
      phoneNumber,
      address,
      pinCode,
      income,
      loanAmount,
      aadhaarFront: aadhaarFrontUrl,
      aadhaarBack: aadhaarBackUrl,
      bankStatement: bankStatementUrl,
      panPic: panUrl,
      otherDocuments: otherDocumentsUrl,
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

    console.log(microloanData);
    res.status(201).json({ microloanData });
  } catch (error) {
    console.error("Error creating Micro Loan :", error);
    res.status(500).json({ error: "Failed to create Micro Loan " });
  }
});
module.exports = { createMicroLoan };
