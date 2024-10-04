const BusBooking = require('../db/models/busbooking');
const catchAsync = require('../utils/catchAsync');
const Franchise = require("../db/models/franchise");
const AppError = require('../utils/appError');

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
        status,
        workId
    });

    if (!newUser) {
        return next(new AppError("Error in creating bus booking", 500))
    }

    return res.status(201).json({
        message: "success",
        data: newUser
    });
});

module.exports = {
    busBooking
}