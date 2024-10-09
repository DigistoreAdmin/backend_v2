const catchAsync = require("../utils/catchAsync");
const cibilReports = require("../db/models/cibilreport");
const azureStorage = require("azure-storage");
const intoStream = require("into-stream");
const AppError = require("../utils/appError");
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

const loanStatus = catchAsync(async (req, res) => {
  try {
    const { customerName, mobileNumber, status, cibilScore } = req.body;
    const { cibilReport } = req.files;

    if (!req.files) {
      throw new AppError("Files not uploaded", 400);
    }

    console.log("body:", req.body);
    console.log("files:", req.files);

    if (!customerName && !mobileNumber) {
      return res.status(404).json({ message: "Missing required fields" });
    }

    const cibilReportDetail = cibilReports();

    const data = await cibilReportDetail.findOne({
      where: {
        customerName: customerName,
        mobileNumber: mobileNumber,
      },
    });

    if (!data) {
      return res.status(404).json({ message: "Record not found" });
    }

    if (status === "approve" || status === "reject") {
      const uploadFile = async (file) => {
        if (file) {
          try {
            return await uploadBlob(file);
          } catch (error) {
            console.error(`Error uploading file ${file.name}:`, error);
            return null;
          }
        }
      };

      const cibilReportUrl = await uploadFile(cibilReport);

      data.status = status;
      data.cibilReport = cibilReportUrl;
      data.cibilScore = cibilScore;

      await data.save();

      res.status(200).json({
        message: "Status, CIBIL Report, and CIBIL Score updated successfully",
        data,
      });
    } else {
      res.status(400).json({ message: "Invalid status value" });
    }
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "An error occurred", error: error.message });
  }
});

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

module.exports = { loanStatus, updateInsuranceDetails };
