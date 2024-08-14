const train_booking = require("../db/models/trainbooking");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const Franchise = require("../db/models/franchise");


const trainBooking = catchAsync(async (req, res, next) => {
  const user = req.user;
  if(!user){
    return next(new AppError("User not found",401));
  }
    const Data = await Franchise.findOne({ where: { email: user.email } });
const uniqueId =Data.franchiseUniqueId
  const {
    customerName,
    phoneNumber,
    email,
    boardingStation,
    destinationStation,
    trainNumber,
    preference,
    startDate,
    passengerDetails,
    status,
  } = req.body;

  const trainBookingDetails = await train_booking.create({
    uniqueId,
    customerName,
    phoneNumber,
    email,
    boardingStation,
    destinationStation,
    trainNumber,
    startDate,
    preference,
    passengerDetails,
    status,
  });
  if(!trainBookingDetails){
    return next(new AppError("Booking failed",500))
  }
  return res.status(200).json({
    status: "success",
    data: trainBookingDetails,
  });
});

module.exports = {
  trainBooking,
};
