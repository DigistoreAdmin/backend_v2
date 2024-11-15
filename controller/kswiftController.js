const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const Franchise = require("../db/models/franchise");
const azureStorage = require("azure-storage");
const intoStream = require("into-stream");
const kswift = require("../db/models/kswift");

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

const kswiftBooking = catchAsync(async (req, res) => {
  console.log(req.body);
  try {
    const {
      customerName,
      phoneNumber,
      email,
      businessName,
      businessAddressLine1,
      businessAddressLine2,
      pinCode,
      businessType,
    } = req.body;

    if (!req.files) {
      throw new AppError("Files not uploaded", 400);
    }

    const aadhaarFrontUrl = await uploadBlob(req.files.aadhaarFront);
    const aadhaarBackUrl = await uploadBlob(req.files.aadhaarBack);
    const signatureUrl = await uploadBlob(req.files.signature);

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
    const newKswiftBooking = await kswift.create({
      uniqueId,
      customerName,
      phoneNumber,
      email,
      businessName,
      businessAddressLine1,
      businessAddressLine2,
      pinCode,
      businessType,
      aadhaarFront: aadhaarFrontUrl,
      aadhaarBack: aadhaarBackUrl,
      signature: signatureUrl,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    console.log(newKswiftBooking);
    res.status(201).json({ newKswiftBooking });
  } catch (error) {
    console.error("kswift booking failed", error);
    res.status(500).json({ error: "kswift booking failed" });
  }
});
module.exports = { kswiftBooking };
