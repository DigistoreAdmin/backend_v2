const fssaiRegistrations = require("../db/models/fssairegistration");
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

const fssaiRegistration = catchAsync(async (req, res, next) => {

    try {
        const { customerName, phoneNumber, email, businessName,
            businessAddressLine1, businessAddressLine2, pinCode, productsOrItems, circleOfTheUnit
        } = req.body
        if (!customerName || !phoneNumber || !email || !businessName || !businessAddressLine1 || !pinCode || !productsOrItems || !circleOfTheUnit) {
            return next(new AppError("All required fields must be provided.", 400));
        }

        const { aadhaarFront, aadhaarBack, panPic, photo, waterTestPaper } = req.files;
        if (!aadhaarFront || !aadhaarBack || !panPic || !photo || !waterTestPaper) {
            return next(new AppError("All required files (aadhaarFront, aadhaarBack, panPic, photo, waterTestPaper) must be uploaded.", 400));
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

        const newFssai = await fssaiRegistrations.create({
            uniqueId,
            customerName,
            phoneNumber,
            email,
            businessName,
            businessAddressLine1,
            businessAddressLine2,
            pinCode,
            productsOrItems,
            circleOfTheUnit,
            aadhaarFront: await uploadFile(aadhaarFront),
            aadhaarBack: await uploadFile(aadhaarBack),
            panPic: await uploadFile(panPic),
            photo: await uploadFile(photo),
            waterTestPaper: await uploadFile(waterTestPaper)
        })

        console.log(newFssai);
        res.status(201).json({ newFssai });
    } catch (error) {
        console.error("Error registering fssai:", error);
        res.status(500).json({ error: "Failed to register fssai" });
    }
})

module.exports = {
    fssaiRegistration
}