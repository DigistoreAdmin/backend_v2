const train_booking = require("../db/models/trainbooking");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const Franchise = require("../db/models/franchise");
const { Op } = require("sequelize");


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

const trainBookingUpdate = catchAsync(async (req, res) => {
  try {

    const {
      id,
      phoneNumber,
      status,
      amount
    } = req.body;
    console.log("req.body: ", req.body);
    const ticket = req?.files?.ticket;

    if (!phoneNumber) {
      return res.status(400).json({ message: "Mobile number is required" });
    }

    const trainBookingUser = train_booking;

    const report = await trainBookingUser.findOne({
      where: { phoneNumber: phoneNumber,id:id },
    });

    if (!report) {
      return res.status(404).json({ message: "Record not found" });
    }

    const finalStatus = status === "completed" ? "completed" : "inProgress";

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
    const count = await trainBookingUser.count({
      where: {
        workId: {
          [Op.like]: `${currentDate}TTB%`,
        },
      },
    });
    const workId = `${currentDate}TTB${(count + 1)
      .toString()
      .padStart(3, "0")}`;

    const ticketUrl = await uploadFile(ticket);

    let serviceCharge=0
    let commissionToFranchise=0
    let commissionToHeadOffice=0
    
    if(amount>100){
      serviceCharge=100
      commissionToFranchise=30
      commissionToHeadOffice=70
    }else{
      serviceCharge=50
      commissionToFranchise=20
      commissionToHeadOffice=30
    }
    
    let totalAmount=amount + serviceCharge

    report.workId = workId || report.workId;
    report.status = finalStatus;
    report.ticket = ticketUrl || report.ticket;
    report.amount = amount || report.amount;
    report.serviceCharge = serviceCharge || report.serviceCharge;
    report.commissionToFranchise =
      commissionToFranchise || report.commissionToFranchise;
    report.commissionToHeadOffice =
      commissionToHeadOffice || report.commissionToHeadOffice;
    report.totalAmount = totalAmount || report.totalAmount;

    await report.save();

    return res.status(200).json({
      message: "success",
      report,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "An error occurred", error: error.message });
  }
});

module.exports = {
  trainBooking,trainBookingUpdate
};
