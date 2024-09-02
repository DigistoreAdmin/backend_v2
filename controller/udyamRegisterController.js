const udyamRegistrations =require('../db/models/udyamregistration')
const azurestorage = require("azure-storage");
const catchAsync = require("../utils/catchAsync");
const intoStream = require("into-stream");
const AppError = require('../utils/appError');
const Franchise = require('../db/models/franchise');

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

const udyamRegistration = catchAsync( async(req,res,next)=>{
try {
    const {
        customerName,
        mobileNumber,
        email,
        businessName,
        addressLine1,
        addressLine2,
        pinCode,
        shopLongitude,
        shopLatitude,
        religionWithCaste,
        totalNumberOfEmployees,
        totalMen,
        totalWomen,
        firmRegistrationDate,
        firmCommencementDate,
        businessType,
        annualTurnOver,
    } = req.body

    if(!customerName || !mobileNumber || !email || !businessName || !addressLine1 || 
          !pinCode || !shopLongitude || !shopLatitude || !religionWithCaste || !totalNumberOfEmployees ||
        !totalMen || !totalWomen || !firmRegistrationDate || !firmCommencementDate || !businessType || !annualTurnOver){
            return next(new AppError("All required fields must be provided",400));
        }
console.log("body", req.body)
    const {
        aadhaarFront,
        aadhaarBack,
        pancard
    }=req.files
    console.log("files",req.files)
    if(!aadhaarBack || !aadhaarFront || !pancard){
        return next(new AppError("All required files must be provided",400));

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

    const user = req.user;
    if (!user) {
        return next(new AppError("Franchise should be logged in", 401))
    }
    const Data = await Franchise.findOne({ where: { email: user.email } });
    uniqueId = Data.franchiseUniqueId

    const newUdyamRegistration = await udyamRegistrations.create({
        uniqueId,
        customerName,
        mobileNumber,
        email,
        businessName,
        addressLine1,
        addressLine2,
        pinCode,
        shopLongitude,
        shopLatitude,
        religionWithCaste,
        totalNumberOfEmployees,
        totalMen,
        totalWomen,
        firmRegistrationDate,
        firmCommencementDate,
        businessType,
        annualTurnOver,
        aadhaarFront: await uploadFile(req.files.aadhaarFront),
        aadhaarBack:await uploadFile(req.files.aadhaarBack),
        pancard:await uploadFile(req.files.pancard)
    })

    if(!newUdyamRegistration){
        return next(new AppError(" Udyam registration failed"));
    }

    console.log(newUdyamRegistration)
    res.status(201).json({status: 'success', data: newUdyamRegistration})

} catch (error) {
    console.error("Error registering udyam:", error);
    res.status(500).json({ error: "Failed to create udyam" });
}
})

module.exports ={
    udyamRegistration
}