const gstFilings = require("../db/models/gstfiling");
const Franchise = require("../db/models/franchise");
const azureStorage = require("azure-storage");
const intoStream = require("into-stream");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const bcrypt = require("bcrypt");

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

const gstFiling = catchAsync(async (req, res, next) => {

    try {
        const { customerName, mobileNumber, email, businessName,
            gstNumber, gstUsername, gstPassword
        } = req.body
        if (!customerName || !mobileNumber || !email || !businessName || !gstNumber || !gstUsername || !gstPassword) {
            return next(new AppError("All required fields must be provided.", 400));
        }

        const { bills } = req.files;
        if (!bills) {
            return next(new AppError("bill must be uploaded", 400));
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
        const hashedPassword = await bcrypt.hash(gstPassword, 8);
        const newGstFiling = await gstFilings.create({
            uniqueId,
            customerName,
            mobileNumber,
            email,
            businessName,
            gstNumber,
            gstUsername,
            gstPassword: hashedPassword,
            bills: await uploadFile(bills)
        })

        console.log(newGstFiling);
        res.status(201).json({ newGstFiling });
    } catch (error) {
        console.error("Error in gst Filing:", error);
        res.status(500).json({ error: "Failed to file gst" });
    }
})

module.exports = gstFiling
