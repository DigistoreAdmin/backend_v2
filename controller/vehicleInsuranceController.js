const Franchise = require("../db/models/franchise");
const defineVehicleInsurance = require("../db/models/vehicleInsurance");
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

const createVehicleInsurance = async (req, res) => {
  try {
    const {
      status,
      assignedId,
      assignedOn,
      completedOn,
      customerName,
      mobileNumber,
      emailId,
      insuranceType,
      commercialOrType2Vehicle,
      isPolicyExpired,
    } = req.body;

    const VehicleInsurance = defineVehicleInsurance(
      commercialOrType2Vehicle,
      isPolicyExpired
    );

    const {
      rcFront,
      rcBack,
      aadhaarFront,
      aadhaarBack,
      panPic,
      vehicleFrontSide,
      vehicleBackSide,
      vehicleLeftSide,
      vehicleRightSide,
      vehicleEngineNumber,
      vehicleChasisNumber,
      otherDocuments,
    } = req.files;

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

    const rcFrontUrl = await uploadFile(rcFront);
    const rcBackUrl = await uploadFile(rcBack);
    const aadhaarFrontUrl = await uploadFile(aadhaarFront);
    const aadhaarBackUrl = await uploadFile(aadhaarBack);
    const panPicUrl = await uploadFile(panPic);
    const vehicleFrontSideUrl = await uploadFile(vehicleFrontSide);
    const vehicleBackSideUrl = await uploadFile(vehicleBackSide);
    const vehicleLeftSideUrl = await uploadFile(vehicleLeftSide);
    const vehicleRightSideUrl = await uploadFile(vehicleRightSide);
    const vehicleEngineNumberUrl = await uploadFile(vehicleEngineNumber);
    const vehicleChasisNumberUrl = await uploadFile(vehicleChasisNumber);
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

    // Generate the workId
    const currentDate = new Date().toISOString().slice(0, 10).split('-').reverse().join('');
    const count = await defineVehicleInsurance().count({
        where: {
            workId: {
                [Op.like]: `${currentDate}VI%`,
            },
        },
    });
    const workId = `${currentDate}VI${(count + 1).toString().padStart(3, '0')}`;

    const newVehicleInsurance = await VehicleInsurance.create({
      status,
      uniqueId,
      workId,
      assignedId,
      assignedOn,
      completedOn,
      customerName,
      mobileNumber,
      emailId,
      insuranceType,
      commercialOrType2Vehicle,
      isPolicyExpired,
      rcFront: rcFrontUrl,
      rcBack: rcBackUrl,
      aadhaarFront: aadhaarFrontUrl,
      aadhaarBack: aadhaarBackUrl,
      panPic: panPicUrl,
      vehicleFrontSide: vehicleFrontSideUrl,
      vehicleBackSide: vehicleBackSideUrl,
      vehicleLeftSide: vehicleLeftSideUrl,
      vehicleRightSide: vehicleRightSideUrl,
      vehicleEngineNumber: vehicleEngineNumberUrl,
      vehicleChasisNumber: vehicleChasisNumberUrl,
      otherDocuments: otherDocumentsUrl,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    if (!newVehicleInsurance) {
      return res.status(400).json({
        status: "fail",
        message: "Invalid data",
      });
    }

    res.status(201).json({
      status: "success",
      data: newVehicleInsurance,
    });
  } catch (error) {
    console.error("Error creating vehicle insurance:", error);
    res.status(500).json({ error: "Failed to create vehicle insurance" });
  }
};

module.exports = { createVehicleInsurance };