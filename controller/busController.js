const BusBooking = require('../db/models/busbooking');
const catchAsync = require('../utils/catchAsync');
const Franchise = require("../db/models/franchise");
const AppError = require('../utils/appError');
const { Op } = require("sequelize");
const azureStorage = require("azure-storage");
const intoStream = require("into-stream");
const blobService = azureStorage.createBlobService(
    process.env.AZURE_STORAGE_CONNECTION_STRING
);
const containerName = "imagecontainer";
const TransactionHistory = require("../db/models/transationhistory");
const Wallet=require('../db/models/wallet');

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

const busBooking = catchAsync(async (req, res, next) => {

    const user = req.user;
    if (!user) {
        return next(new AppError("Franchise should be logged in", 401))
    }
    const Data = await Franchise.findOne({ where: { email: user.email } });
    uniqueId = Data.franchiseUniqueId

    const { customerName, phoneNumber, email, boardingStation, destinationStation, startDate, preference, passengerDetails, status } = req.body;

    const newUser = await BusBooking.create({
        uniqueId,
        customerName,
        phoneNumber,
        email,
        boardingStation,
        destinationStation,
        startDate,
        preference,
        passengerDetails,
        status
    });

    if (!newUser) {
        return next(new AppError("Error in creating bus booking", 500))
    }

    return res.status(201).json({
        message: "success",
        data: newUser
    });
});

const updateBusBooking = catchAsync(async (req, res) => {

    const user = req.user
    try {
        let status = "inProgress"
        const { id, uniqueId, phoneNumber, amount,
        } = req.body;
        console.log("req.body: ", req.body);
        const ticket = req?.files?.ticket;

        if (!phoneNumber) {
            return res.status(400).json({ message: "Mobile number is required" });
        }

        const franchiseData = await Franchise.findOne({
            where: { franchiseUniqueId: uniqueId },
        });

        const walletData = await Wallet.findOne({ where: { uniqueId } })
        console.log('walletData: ', walletData);
        if (!walletData) {
            return res.status(404).json({ message: "No wallet data associated with this franchise" })
        }
        const { balance } = walletData

        const data = await BusBooking.findOne({
            where: { phoneNumber, id },
        });

        if (!data) {
            return res.status(404).json({ message: "No bus booking data found" });
        }

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

        const currentDate = new Date()
            .toISOString()
            .slice(0, 10)
            .split("-")
            .reverse()
            .join("");
        const count = await BusBooking.count({
            where: {
                workId: {
                    [Op.like]: `${currentDate}BTB%`,
                },
            },
        });
        const workId = `${currentDate}BTB${(count + 1)
            .toString()
            .padStart(3, "0")}`;

        const ticketUrl = await uploadFile(ticket);

        const { serviceCharge, commissionToFranchise, commissionToHO } = calculateCommission(amount)

        let totalAmount = parseInt(amount) + serviceCharge
        if (totalAmount > balance) {
            return res.status(400).json({ message: "Insufficient balance for franchise" });
        }

        status = "completed"
        data.workId = workId || data.workId;
        data.status = status;
        data.ticket = ticketUrl || data.ticket;
        data.amount = amount || data.amount
        data.serviceCharge = serviceCharge || data.serviceCharge
        data.commissionToFranchise = commissionToFranchise || data.commissionToFranchise
        data.commissionToHO = commissionToHO || data.commissionToHO
        data.totalAmount = totalAmount || data.totalAmount

        await data.save();

        const newBalance = Math.round(balance - totalAmount);

        await Wallet.update(
            { balance: newBalance },
            { where: { uniqueId } }
        );

        const transactionId = generateRandomId();

        const newTransactionHistory = await TransactionHistory.create({
            transactionId: transactionId,
            uniqueId: franchiseData.franchiseUniqueId,
            userName: franchiseData.franchiseName,
            userType: user.userType,
            service: "busBooking",
            customerNumber: phoneNumber,
            serviceNumber: "",
            serviceProvider: "busBooking",
            status: "success",
            amount: totalAmount,
            franchiseCommission: commissionToFranchise,
            adminCommission: commissionToHO,
            walletBalance: newBalance,
        });

        newTransactionHistory.save()

        if (newTransactionHistory) {
            let updated = newBalance + commissionToFranchise;

            await Wallet.update(
                { balance: updated },
                { where: { uniqueId: franchiseData.franchiseUniqueId } }
            );
        }

        return res.status(200).json({
            message: "success",
            data,
            newTransactionHistory
        });
    } catch (error) {
        console.error(error);
        return res
            .status(500)
            .json({ message: "An error occurred", error: error.message });
    }
});

function calculateCommission(amount) {
    let serviceCharge = 0
    let commissionToFranchise = 0
    let commissionToHO = 0
    if (amount < 500) {
        serviceCharge = 50
        commissionToFranchise = 30
        commissionToHO = 20
    } else if (amount < 1000) {
        serviceCharge = 70
        commissionToFranchise = 40
        commissionToHO = 30
    } else {
        serviceCharge = 100
        commissionToFranchise = 50
        commissionToHO = 50
    }
    return { serviceCharge, commissionToFranchise, commissionToHO };
}

function generateRandomId() {
    const prefix = "DSP";
    const timestamp = Date.now().toString();
    return prefix + timestamp;
}

module.exports = {
    busBooking,
    updateBusBooking
}