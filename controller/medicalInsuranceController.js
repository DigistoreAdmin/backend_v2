const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const Franchise = require("../db/models/franchise");
const azureStorage = require("azure-storage");
const intoStream = require("into-stream");
const medicalInsuranceData = require("../db/models/medicalinsurance");
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

const medicalInsuranceCreate = catchAsync(async (req, res, next) => {
  const {
    customerName,
    phoneNumber,
    emailId,
    individualOrFamily,
    dob,
    preferredHospital,
    sumInsuredLookingFor,
    otherAddOn,
    anyExistingDisease,
    numberOfAdult,
    numberOfKids,
    height,
    weight,
    assignedId,
    status,
    assignedOn,
    completedOn,
  } = req.body;

  const { aadharFront, aadharBack, pan, bank } = req.files || {};
  console.log("Request Body:", req.body);
  console.log("Request Files:", req.files);

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
  // Upload files
  const fileUrls = await Promise.all([
    uploadFile(aadharFront),
    uploadFile(aadharBack),
    uploadFile(pan),
    uploadFile(bank),
  ]);

  console.log("File URLs:", fileUrls);

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

  // Generate workId based on today's date
  const currentDate = new Date()
    .toISOString()
    .slice(0, 10)
    .split("-")
    .reverse()
    .join("");
  const count = await medicalInsuranceData(individualOrFamily).count({
    where: {
      workId: {
        [Op.like]: `${currentDate}MI%`,
      },
    },
  });
  const workId = `${currentDate}PL${(count + 1).toString().padStart(3, "0")}`;

  let additionalData = {};
  let familyDetails = [];
  switch (individualOrFamily) {
    case "individual":
      additionalData = {
        individualOrFamily,
        dob,
        preferredHospital,
        sumInsuredLookingFor,
        otherAddOn: otherAddOn || null,
        anyExistingDisease,
        height,
        weight,
      };
      break;

    case "family":
      if (numberOfAdult > 0) {
        for (let i = 1; i <= numberOfAdult; i++) {
          familyDetails.push({
            id: `Adult${i}`,
            dob: req.body[`Adult${i}dob`],
            preferredHospital: req.body[`Adult${i}preferredHospital`],
            sumInsuredLookingFor: req.body[`Adult${i}sumInsuredLookingFor`],
            otherAddOn: req.body[`Adult${i}otherAddOn`],
            anyExistingDisease: req.body[`Adult${i}anyExistingDisease`],
            height: req.body[`Adult${i}height`],
            weight: req.body[`Adult${i}weight`],
          });
        }
      }

      if (numberOfKids > 0) {
        for (let i = 1; i <= numberOfKids; i++) {
          familyDetails.push({
            id: `Kid${i}`,
            dob: req.body[`Kid${i}dob`],
            preferredHospital: req.body[`Kid${i}preferredHospital`],
            sumInsuredLookingFor: req.body[`Kid${i}sumInsuredLookingFor`],
            otherAddOn: req.body[`Kid${i}otherAddOn`] || null,
            anyExistingDisease: req.body[`Kid${i}anyExistingDisease`],
            height: req.body[`Kid${i}height`],
            weight: req.body[`Kid${i}weight`],
          });
        }
      }

      additionalData = {
        individualOrFamily,
        numberOfAdult,
        numberOfKids,
        familyDetails,
      };
      break;

    default:
      break;
  }

  const medicalInsuranceDb = medicalInsuranceData(individualOrFamily);
  const createMedicalInsurance = await medicalInsuranceDb.create({
    uniqueId,
    workId,
    customerName,
    phoneNumber,
    emailId,
    ...additionalData,
    aadharFront: fileUrls[0],
    aadharBack: fileUrls[1],
    pan: fileUrls[2],
    bank: fileUrls[3],
    assignedId,
    status,
    assignedOn,
    completedOn,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  res.status(201).json({
    status: "success",
    data: {
      medicalInsurance: createMedicalInsurance,
    },
  });
});

module.exports = { medicalInsuranceCreate };


