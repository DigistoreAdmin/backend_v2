const {  Op } = require('sequelize'); 

const businessLoanExistingDetails = require("../../db/models/businessloanexisting");
const Franchise = require("../../db/models/franchise");
const azureStorage = require("azure-storage");
const intoStream = require("into-stream");
const AppError = require("../../utils/appError");
const catchAsync = require("../../utils/catchAsync");

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

const businessLoanExisting = catchAsync(async (req, res, next) => {

    try {
        const {
            customerName,
            email,
            mobileNumber,
            cibilScore,
            loanAmount,
            cibil,
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

        // Generate the workId
        const currentDate = new Date().toISOString().slice(0, 10).split('-').reverse().join('');
        const count = await businessLoanExistingDetails(cibil).count({
            where: {
                workId: {
                    [Op.like]: `${currentDate}BLE%`,
                },
            },
        });
        const workId = `${currentDate}BLE${(count + 1).toString().padStart(3, '0')}`;


        const businessLoanExisting = businessLoanExistingDetails(cibil)

        const newBusinessLoanExisting = await businessLoanExisting.create({
            uniqueId,
            workId,
            customerName,
            email,
            mobileNumber,
            cibil,
            cibilScore: cibil === 'true' ? cibilScore : null,
            loanAmount,
            cibilReport: cibil === 'true' ? await uploadFile(req.files.cibilReport) : null,
            cibilAcknowledgement: cibil === "false" ? await uploadFile(req.files.cibilAcknowledgement) : null,
            titleDeed: await uploadFile(req.files.titleDeed),
            locationSketch: await uploadFile(req.files.locationSketch),
            sourceOfIncome: await uploadFile(req.files.sourceOfIncome),
            encumbrance: await uploadFile(req.files.encumbrance),
            possession: await uploadFile(req.files.possession),
            buildingTax: await uploadFile(req.files.buildingTax),
            landTax: await uploadFile(req.files.landTax),
            invoiceCopyOfAssetsToPurchase: await uploadFile(req.files.invoiceCopyOfAssetsToPurchase),
            balanceSheetAndP1_2Years: await uploadFile(req.files.balanceSheetAndP1_2Years),
            bankStatement_1Year: await uploadFile(req.files.bankStatement_1Year),
            rentAgreement: await uploadFile(req.files.rentAgreement),
            licenceCopy: await uploadFile(req.files.licenceCopy),
            otherDocuments: await uploadFile(req.files.otherDocuments),
            gstDetails: await uploadFile(req.files.gstDetails),
            createdAt: new Date(),
            updatedAt: new Date(),
        });

        console.log(newBusinessLoanExisting);
        res.status(201).json({ newBusinessLoanExisting });
    } catch (error) {
        console.error("Error in business loan existing:", error);
        res.status(500).json({ error: "Failed create business loan existing" });
    }
});

module.exports = businessLoanExisting;
