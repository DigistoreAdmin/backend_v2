const catchAsync = require("../../utils/catchAsync");
const AppError = require("../../utils/appError");
const intoStream = require("into-stream");
const azureStorage = require("azure-storage");
const containerName = "imagecontainer";
const businessLoanExistingDetails = require("../../db/models/businessloanexisting")
const defineBusinessLoanNewSecured = require("../../db/models/businessLoanNewSecured");
const defineBusinessLoanUnsecuredNew = require("../../db/models/businessloanunsecurednew");
const defineBusinessLoanUnscuredExisting = require("../../db/models/BusinessLoanUnsecuredExisting");
const defineHousingLoan = require("../../db/models/HousingLoan");
const LoanAgainstProperty = require("../../db/models/loanAgainstProperty");
const definePersonalLoan = require("../../db/models/personalloan");
const newVehicleLoan = require("../../db/models/newvehicleloan");
const usedVehicleLoan = require("../../db/models/vehicleloanused");

const blobService = azureStorage.createBlobService(
    process.env.AZURE_STORAGE_CONNECTION_STRING
);

const updateLoan = catchAsync(async (req, res, next) => {
    try {

        if (!req.body) {
            return next(new AppError("Fields are required", 400));
        }
        const {
            phoneNumber,
            loanType,
            loanStatus,
            rejectReason,
            bankDetails,
            loanGivenByBank,
            doneBy,
            serviceCharge,
            commissionToFranchise,
            commissionToHO,
            otherPayments,
        } = req.body;

        const allowedLoanTypes = ["businessLoanExisting", "businessLoanNewSecured", "businessLoanNewUnsecured",
            "busineeLoanUnsecuredExisting", "housingLoan", "loanAgainstProperty",
            "personalLoan", "vehicleLoanNew", "vehicleLoanUsed"
        ]

        if (!allowedLoanTypes.includes(loanType)) {
            return next(new AppError(`Invalid loan type.. Allowed types are ${allowedLoanTypes}`, 400));
        }

        const otherDocuments = req.files?.otherDocuments || null;

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

        if (!phoneNumber) {
            return next(new AppError("Phone number is required", 400));
        }

        let tableName;
        console.log('loanType: ', loanType);
        switch (loanType) {
            case "businessLoanExisting":
                tableName = businessLoanExistingDetails()
                break
            case "businessLoanNewSecured":
                tableName = defineBusinessLoanNewSecured()
                break
            case "businessLoanNewUnsecured":
                tableName = defineBusinessLoanUnsecuredNew()
                break
            case "busineeLoanUnsecuredExisting":
                tableName = defineBusinessLoanUnscuredExisting()
                break
            case "housingLoan":
                tableName = defineHousingLoan()
                break
            case "loanAgainstProperty":
                tableName = LoanAgainstProperty()
                break
            case "personalLoan":
                tableName = definePersonalLoan()
                break
            case "vehicleLoanNew":
                tableName = newVehicleLoan()
                break
            case "vehicleLoanUsed":
                tableName = usedVehicleLoan()
                break
            default:
                return next(new AppError("Invalid loan type"));
        }

        console.log("tableName: ", tableName);

        let dataToBeUpdated = await tableName.findOne({
            where: { mobileNumber: phoneNumber }
        });

        if (!dataToBeUpdated) {
            return next(new AppError('Record not found'));
        }

        if (rejectReason) {
            await dataToBeUpdated.update({
                loanType: loanType || dataToBeUpdated.loanType,
                loanStatus: loanStatus || dataToBeUpdated.loanStatus,
                rejectReason: rejectReason || dataToBeUpdated.rejectReason
            })

            return res.status(200).json({
                message: `${loanType} updated with reject reason: ${rejectReason}`,
                data: dataToBeUpdated
            });
        }

        await dataToBeUpdated.update({
            loanType: loanType || dataToBeUpdated.loanType,
            loanStatus: loanStatus || dataToBeUpdated.loanStatus,
            rejectReason: rejectReason || dataToBeUpdated.rejectReason,
            bankDetails: bankDetails || dataToBeUpdated.bankDetails,
            loanGivenByBank: loanGivenByBank || dataToBeUpdated.loanGivenByBank,
            doneBy: doneBy || dataToBeUpdated.doneBy,
            serviceCharge: serviceCharge || dataToBeUpdated.serviceCharge,
            commissionToFranchise: commissionToFranchise || dataToBeUpdated.commissionToFranchise,
            commissionToHO: commissionToHO || dataToBeUpdated.commissionToHO,
            otherPayments: otherPayments || dataToBeUpdated.otherPayments,
            otherDocuments: otherDocuments ? await uploadBlob(otherDocuments) : dataToBeUpdated.otherDocuments
        });

        await dataToBeUpdated.save();

        res.status(200).json({ message: `${loanType} updated successfully`, data: dataToBeUpdated });

    } catch (error) {
        console.error(`Error in updating ${loanType}:`, error);
        res.status(500).json({
            error: `${loanType} updation failed`,
        });
    }
})

module.exports = { updateLoan }