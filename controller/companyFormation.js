const azurestorage = require("azure-storage");
const intoStream = require("into-stream");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const Franchise = require("../db/models/franchise");
const companyFormations = require("../db/models/companyformation");

const containerName = "imagecontainer";
const blobService = azurestorage.createBlobService(
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

const companyFormation = catchAsync(async (req, res, next) => {
  try {
    const {
      customerName,
      mobileNumber,
      email,
      businessType,
      businessName,
      businessAddressLine1,
      businessAddressLine2,
      numberOfDirectors,
      directorDetails,
      shareHoldingDetails,
    } = req.body;

    if (
      !customerName ||
      !mobileNumber ||
      !email ||
      !businessType ||
      !businessName ||
      !businessAddressLine1 ||
      !businessAddressLine2 ||
      !numberOfDirectors ||
      !shareHoldingDetails
    ) {
      return next(new AppError("All required fields must be provided", 400));
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

    let updatedDirectorsDetails = [];

    for (let i = 1; i <= numberOfDirectors; i++) {
      const directorNumber = `${i}`;
      const panCardFile = req.files[`director${i}panCard`];
      const aadhaarFrontFile = req.files[`director${i}aadhaarFront`];
      const aadhaarBackFile = req.files[`director${i}aadhaarBack`];
      const bankStatementFile = req.files[`director${i}bankStatement`];
      const signatureFile = req.files[`director${i}signature`];
      const photoFile = req.files[`director${i}photo`];
      const digitalSignatureCertificateFile =
        req.files[`director${i}digitalSignatureCertificate`];
      const addressProofFile = req.files[`director${i}addressProof`];
      try {
        // const panCard=await uploadFile(panCardFile)
        // const aadhaarFront=await uploadFile(aadhaarFrontFile)
        // const aadhaarBack=await uploadFile(aadhaarBackFile)
        // const signature=await uploadFile(signatureFile)
        // const photo=await uploadFile(photoFile)
        // const digitalSignatureCertificate=await uploadFile(digitalSignatureCertificateFile)
        // const addressProof=await uploadFile(addressProofFile)

        updatedDirectorsDetails.push({
          directorNumber: directorNumber,
          panCard: await uploadFile(panCardFile),
          aadhaarFront: await uploadFile(aadhaarFrontFile),
          aadhaarBack: await uploadFile(aadhaarBackFile),
          bankStatement: await uploadFile(bankStatementFile),
          signature: await uploadFile(signatureFile),
          photo: await uploadFile(photoFile),
          digitalSignatureCertificate: await uploadFile(
            digitalSignatureCertificateFile
          ),
          addressProof: await uploadFile(addressProofFile),
        });
        console.log(updatedDirectorsDetails);
      } catch (error) {
        return next(new AppError("Error processing files", 500));
      }
    }

    const user = req.user;
    if (!user) {
      return next(new AppError("Franchise should be logged in", 401));
    }
    const Data = await Franchise.findOne({ where: { email: user.email } });
    const uniqueId = Data.franchiseUniqueId;

    const {
      addressProof,
      bankStatement,
      NOC,
      educationDetails,
      rentAgreement,
    } = req.files;

    if (
      !addressProof ||
      !bankStatement ||
      !rentAgreement ||
      !NOC ||
      !educationDetails
    ) {
      return next(new AppError("All required files must be provided", 400));
    }

    const newCompanyFormation = await companyFormations.create({
      uniqueId,
      customerName,
      mobileNumber,
      email,
      businessType,
      businessName,
      businessAddressLine1,
      businessAddressLine2,
      numberOfDirectors,
      directorDetails: updatedDirectorsDetails,
      addressProof: await uploadFile(req.files.addressProof),
      bankStatement: await uploadFile(req.files.bankStatement),
      NOC: await uploadFile(req.files.NOC),
      educationDetails: await uploadFile(req.files.educationDetails),
      rentAgreement: await uploadFile(req.files.rentAgreement),
      shareHoldingDetails
    });

    if (!newCompanyFormation) {
      return next(new AppError("company formation failed"));
    }

    console.log(newCompanyFormation);
    res.status(201).json({ status: "success", data: newCompanyFormation });
  } catch (error) {
    console.error("Error in company formation:", error);
    res.status(500).json({ error: "Failed to create company formation" });
  }
});

module.exports = { companyFormation };
