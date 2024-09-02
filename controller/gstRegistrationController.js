const gstRegistrationDetails = require("../db/models/gstregistration");
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

const gstRegistration = catchAsync(async (req, res, next) => {

    try {
        const {
            customerName,
            customerEmailId,
            customerMobile,
            businessName,
            businessAddressLine1,
            businessAddressLine2,
            pinCode,
            building,
            shopLatitude,
            shopLongitude,
            typeOfBusiness,
            residenceLatitude,
            residenceLongitude,
            noOfPartners,
            noOfDirectors,
        } = req.body;

        if (!req.files) {
            return next(new AppError("Files not uploaded", 400));
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


        let updatedPartnersDetails = [];

        if (typeOfBusiness === 'partnership') {
            if (!req.files) {
                return next(new AppError("No partner files uploaded or incorrect format", 400));
            }

            for (let i = 1; i <= noOfPartners; i++) {
                const partnerNo = `${i}`
                const photoFile = req.files[`partner${i}photo`]
                const panCardFile = req.files[`partner${i}panCard`]
                const aadhaarFrontFile = req.files[`partner${i}aadhaarFront`]
                const aadhaarBackFile = req.files[`partner${i}aadhaarBack`]
                const addressLine1 = req.body[`partner${i}addressLine1`]
                const addressLine2 = req.body[`partner${i}addressLine2`]
                const pincode = req.body[`partner${i}pincode`]
                const latitude = req.body[`partner${i}latitude`]
                const longitude = req.body[`partner${i}longitude`]
                if (panCardFile && photoFile && aadhaarFrontFile && aadhaarBackFile &&
                    addressLine1 && pincode && latitude && longitude) {
                    try {
                        const panCardImg = await uploadFile(panCardFile);
                        const photoImg = await uploadFile(photoFile);
                        const aadhaarFrontImg = await uploadFile(aadhaarFrontFile)
                        const aadhaarBackImg = await uploadFile(aadhaarBackFile)

                        updatedPartnersDetails.push({
                            partnerNo: partnerNo,
                            photo: photoImg,
                            panCard: panCardImg,
                            aadhaarFront: aadhaarFrontImg,
                            aadhaarBack: aadhaarBackImg,
                            addressLine1: addressLine1,
                            addressLine2: addressLine2 ? addressLine2 : null,
                            pincode: pincode,
                            latitude: latitude,
                            longitude: longitude
                        });
                    } catch (error) {
                        return next(new AppError("Error processing partnersDetails", 500));
                    }
                } else {
                    return next(new AppError("Missing required files", 400));
                }

            }
        }
        let updatedDirectorsDetails = [];

        if (typeOfBusiness === 'company') {
            if (!req.files) {
                return next(new AppError("No partner files uploaded or incorrect format", 400));
            }

            for (let i = 1; i <= noOfDirectors; i++) {
                const directorNo = `${i}`
                const panCardFile = req.files[`director${i}panCard`]
                const pin = req.body[`director${i}pin`]
                const photoFile = req.files[`director${i}photo`]
                const aadhaarFrontFile = req.files[`director${i}aadhaarFront`]
                const aadhaarBackFile = req.files[`director${i}aadhaarBack`]
                const addressLine1 = req.body[`director${i}addressLine1`]
                const addressLine2 = req.body[`director${i}addressLine2`]
                const latitude = req.body[`director${i}latitude`]
                const longitude = req.body[`director${i}longitude`]
                if (panCardFile && photoFile && pin && aadhaarFrontFile && aadhaarBackFile &&
                    addressLine1 && latitude && longitude) {
                    try {
                        const panCardImg = await uploadFile(panCardFile);
                        const photoImg = await uploadFile(photoFile);
                        const aadhaarBackImg = await uploadFile(aadhaarBackFile)
                        const aadhaarFrontImg = await uploadFile(aadhaarFrontFile)

                        updatedDirectorsDetails.push({
                            directorNo: directorNo,
                            panCard: panCardImg,
                            pin: pin,
                            photo: photoImg,
                            aadhaarFront: aadhaarFrontImg,
                            aadhaarBack: aadhaarBackImg,
                            addressLine1: addressLine1,
                            addressLine2: addressLine2 ? addressLine2 : null,
                            latitude: latitude,
                            longitude: longitude
                        });
                    } catch (error) {
                        return next(new AppError("Error processing director details", 500));
                    }
                } else {
                    return next(new AppError("Missing required files", 400));
                }

            }
        }

        let additionalData = {}

        switch (typeOfBusiness) {
            case "proprietary":
                additionalData = {
                    // shopGmapPic: await uploadFile(req.files.shopGmapPic),
                    residenceLatitude,
                    residenceLongitude,
                    panCardImage: await uploadFile(req.files.panCardImg),
                    aadhaarFront: await uploadFile(req.files.aadhaarFront),
                    aadhaarBack: await uploadFile(req.files.aadhaarBack),
                    passportSizePhoto: await uploadFile(req.files.passportSizePhoto),
                    bankDetails: await uploadFile(req.files.bankDetails),
                };
                break;
            case "partnership":
                additionalData = {
                    noOfPartners,
                    partnersDetails: typeOfBusiness === 'partnership' ? updatedPartnersDetails : undefined,
                    partnershipDeed: await uploadFile(req.files.partnershipDeed),
                    bankDetails: await uploadFile(req.files.bankDetails),
                }
                break;
            case "company":
                additionalData = {
                    incorporationCertificate: await uploadFile(req.files.incorporationCertificate),
                    noOfDirectors,
                    directorsDetails: typeOfBusiness === 'company' ? updatedDirectorsDetails : undefined,
                }
                break;
        }

        const gstRegistration = gstRegistrationDetails(typeOfBusiness)

        const newGst = await gstRegistration.create({
            uniqueId,
            customerName,
            customerEmailId,
            customerMobile,
            businessName,
            businessAddressLine1,
            businessAddressLine2,
            pinCode,
            building,
            shopLatitude,
            shopLongitude,
            typeOfBusiness,
            noObjectionCertificate: await uploadFile(req.files.noObjectionCertificate),
            rentAgreement: await uploadFile(req.files.rentAgreement),
            buildingTaxReceipt: await uploadFile(req.files.buildingTaxReceipt),
            landTaxReceipt: await uploadFile(req.files.landTaxReceipt),
            propertyTaxReceipt: await uploadFile(req.files.propertyTaxReceipt),
            ...additionalData,
            createdAt: new Date(),
            updatedAt: new Date(),
        });

        console.log(newGst);
        res.status(201).json({ newGst });
    } catch (error) {
        console.error("Error registering gst:", error);
        res.status(500).json({ error: "Failed to create gst" });
    }
});

module.exports = gstRegistration;
