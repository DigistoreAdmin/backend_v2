const definePassportDetails = require("../db/models/passport");
const Place = require("../db/models/passportOffice");
const Franchise = require("../db/models/franchise");
const azureStorage = require("azure-storage");
const intoStream = require("into-stream");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

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

const createPassport = catchAsync(async (req, res) => {
  try {
    console.log("req.body: ", req.body);
    console.log("req.files: ", req.files);
    const {
      passportRenewal,
      oldPassportNumber,
      customerName,
      customerEmail,
      mobileNumber,
      educationQualification,
      personalAddress,
      maritalStatus,
      spouseName,
      employmentType,
      birthPlace,
      identificationMark1,
      identificationMark2,
      policeStation,
      village,
      emergencyContactPerson,
      emergencyContactNumber,
      emergencyContactAddress,
      passportOfficePreference,
      appointmentDatePreference1,
      appointmentDatePreference2,
      appointmentDatePreference3,
    } = req.body;

    if (!req.files) {
      throw new AppError("Files not uploaded", 400);
    }

    const proofOfIdentityUrl = await uploadBlob(req.files.proofOfIdentity);
    const proofOfDobUrl = await uploadBlob(req.files.proofOfDob);
    const proofOfAddressUrl = await uploadBlob(req.files.proofOfAddress);
    let oldPassportCopyUrl = null;
    if (passportRenewal === "true") {
      oldPassportCopyUrl = await uploadBlob(req.files.oldPassportCopy);
    }
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

    const Passport = definePassportDetails(maritalStatus, passportRenewal);

    const newPassport = await Passport.create({
      uniqueId,
      oldPassportNumber,
      customerName,
      customerEmail,
      mobileNumber,
      educationQualification,
      personalAddress,
      maritalStatus,
      spouseName,
      employmentType,
      birthPlace,
      identificationMark1,
      identificationMark2,
      policeStation,
      village,
      emergencyContactPerson,
      emergencyContactNumber,
      emergencyContactAddress,
      passportOfficePreference,
      appointmentDatePreference1,
      appointmentDatePreference2,
      appointmentDatePreference3,
      proofOfIdentity: proofOfIdentityUrl,
      proofOfDob: proofOfDobUrl,
      proofOfAddress: proofOfAddressUrl,
      oldPassportCopy: oldPassportCopyUrl,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    console.log(newPassport);
    res.status(201).json({ newPassport });
  } catch (error) {
    console.error("Error creating passport:", error);
    res.status(500).json({ error: "Failed to create passport" });
  }
});

const getPlacesByZone = catchAsync(async (req, res) => {
  try {
    const { zone } = req.query;
    const whereClause = zone ? { zone } : {};

    const places = await Place.findAll({ where: whereClause });

    if (!places || places.length === 0) {
      return res.status(404).json({ error: "No places found" });
    }

    res.json(places);
  } catch (error) {
    console.error("Error fetching places:", error);
    res.status(500).json({ error: "Failed to fetch places" });
  }
});

module.exports = {
  createPassport,
  getPlacesByZone,
};
