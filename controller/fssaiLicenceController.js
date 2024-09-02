const fssaiLicences = require("../db/models/fssailicence");
const Franchise = require("../db/models/franchise");
const azureStorage = require("azure-storage");
const intoStream = require("into-stream");
const AppError = require("../utils/appError");
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

const fssaiLicence = catchAsync(async (req, res, next) => {

    try {
        const { customerName, mobileNumber, email, businessName,
            businessAddressLine1, businessAddressLine2, pincode, productsOrItems, circleOfTheUnit
        } = req.body
        if (!customerName || !mobileNumber || !email || !businessName || !businessAddressLine1 || !pincode || !productsOrItems || !circleOfTheUnit) {
            return next(new AppError("All required fields must be provided.", 400));
        }

        const { aadhaarFront, aadhaarBack, panCard, photo, waterTestPaper } = req.files;
        if (!aadhaarFront || !aadhaarBack || !panCard || !photo || !waterTestPaper) {
            return next(new AppError("All required files (aadhaarFront, aadhaarBack, panCard, photo, waterTestPaper) must be uploaded.", 400));
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
            return next(new AppError("User not found", 401));
        }

        const franchise = await Franchise.findOne({
            where: { email: user.email },
        });

        const uniqueId = franchise.franchiseUniqueId;
        if (!uniqueId) {
            return next(new AppError("Missing unique id for the franchise", 400));
        }

        const newFssai = await fssaiLicences.create({
            uniqueId,
            customerName,
            mobileNumber,
            email,
            businessName,
            businessAddressLine1,
            businessAddressLine2,
            pincode,
            productsOrItems,
            circleOfTheUnit,
            aadhaarFront: await uploadFile(aadhaarFront),
            aadhaarBack: await uploadFile(aadhaarBack),
            panCard: await uploadFile(panCard),
            photo: await uploadFile(photo),
            waterTestPaper: await uploadFile(waterTestPaper)
        })

        console.log(newFssai);
        res.status(201).json({ newFssai });
    } catch (error) {
        console.error("Error in fssai licence:", error);
        res.status(500).json({ error: "Failed to register fssai licence" });
    }
})

module.exports = {
    fssaiLicence
}