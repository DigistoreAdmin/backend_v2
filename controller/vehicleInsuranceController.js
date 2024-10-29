const Franchise = require("../db/models/franchise");
const defineVehicleInsurance = require("../db/models/vehicleInsurance");
const azureStorage = require("azure-storage");
const intoStream = require("into-stream");
const { Op } = require("sequelize");
const catchAsync = require("../utils/catchAsync");

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
      anyClaims,
    } = req.body;

    const VehicleInsurance = defineVehicleInsurance(
      commercialOrType2Vehicle,
      isPolicyExpired,
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
      previousPolicyDocument,
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
    const previousPolicyDocumentUrl = await uploadFile(previousPolicyDocument);

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
      anyClaims,
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
      previousPolicyDocument: previousPolicyDocumentUrl,
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


module.exports = { createVehicleInsurance,updateInsuranceDetails };