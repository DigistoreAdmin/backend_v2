const defineTrainBooking = require("../db/models/trainbooking");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const Franchise = require("../db/models/franchise");
const { Op } = require("sequelize");
const wallets = require("../db/models/wallet");
const transationHistory = require("../db/models/transationhistory");

const trainBooking = catchAsync(async (req, res, next) => {
  const user = req.user;
  if (!user) {
    return next(new AppError("User not found", 401));
  }
  const Data = await Franchise.findOne({ where: { email: user.email } });
  const uniqueId = Data.franchiseUniqueId;
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
    bookingType,
    returnDate,
    coachType,
    ticketType
  } = req.body;
  
  const train_booking = defineTrainBooking(bookingType)
  

  const currentDate = new Date()
      .toISOString()
      .slice(0, 10)
      .split("-")
      .reverse()
      .join("");
    const count = await train_booking.count({
      where: {
        workId: {
          [Op.like]: `${currentDate}TTB%`,
        },
      },
    });
    const workId = `${currentDate}TTB${(count + 1)
      .toString()
      .padStart(3, "0")}`;
      


  const trainBookingDetails = await train_booking.create({
    uniqueId,
    workId,
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
    bookingType,
    returnDate:bookingType=="1"? null:returnDate,
    coachType,
    ticketType
  });
  if (!trainBookingDetails) {
    return next(new AppError("Booking failed", 500));
  }
  return res.status(200).json({
    status: "success",
    data: trainBookingDetails,
  });
});

const trainBookingUpdate = catchAsync(async (req, res, next) => {
  try {
    const user = req.user;

    const { id, phoneNumber, status, amount, uniqueId } = req.body;
    console.log("req.body: ", req.body);
    const ticket = req?.files?.ticket;

    if (!phoneNumber) {
      return res.status(400).json({ message: "Mobile number is required" });
    }

    const franchiseData = await Franchise.findOne({
      where: { franchiseUniqueId: uniqueId },
    });

    if (!franchiseData) return next(new AppError("Franchise not found", 404));

    const walletData = await wallets.findOne({
      where: { uniqueId: franchiseData.franchiseUniqueId },
    });

    if (!walletData) return next(new AppError("Wallet not found", 404));

    const train_booking=defineTrainBooking()

    const report = await train_booking.findOne({
      where: { phoneNumber: phoneNumber, id: id },
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

    

    const ticketUrl = await uploadFile(ticket);

    let serviceCharge = 0;
    let commissionToFranchise = 0;
    let commissionToHO = 0;

    if (amount < 500) {
      serviceCharge = 50;
      commissionToFranchise = 30;
      commissionToHO = 20;
    } else if (amount < 1000) {
      serviceCharge = 70;
      commissionToFranchise = 40;
      commissionToHO = 30;
    } else {
      serviceCharge = 100;
      commissionToFranchise = 50;
      commissionToHO = 50;
    }

    let totalAmount = parseInt(amount) + serviceCharge;

    report.workId = workId || report.workId;
    report.status = finalStatus;
    report.ticket = ticketUrl || report.ticket;
    report.amount = amount || report.amount;
    report.serviceCharge = serviceCharge || report.serviceCharge;
    report.commissionToFranchise =
      commissionToFranchise || report.commissionToFranchise;
    report.commissionToHO =
      commissionToHO || report.commissionToHO;
    report.totalAmount = totalAmount || report.totalAmount;

    if (totalAmount > walletData.balance) {
      return next(new AppError("Insufficient wallet balance", 401));
    }

    await report.save();

    const newBalance = Math.round(walletData.balance - totalAmount);

    await wallets.update(
      { balance: newBalance },
      { where: { uniqueId: franchiseData.franchiseUniqueId } }
    );

    const transactionId = generateRandomId();

    const newTransactionHistory = await transationHistory.create({
      transactionId: transactionId,
      uniqueId: franchiseData.franchiseUniqueId,
      userName: franchiseData.franchiseName,
      userType: user.userType,
      service: "trainBooking",
      customerNumber: phoneNumber,
      serviceNumber: "",
      serviceProvider: "trainBooking",
      status: "success",
      amount: totalAmount,
      franchiseCommission: commissionToFranchise,
      adminCommission: commissionToHO,
      walletBalance: newBalance,
    });

    if (newTransactionHistory) {
      let updated = newBalance + commissionToFranchise;

      await wallets.update(
        { balance: updated },
        { where: { uniqueId: franchiseData.franchiseUniqueId } }
      );
    }

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

function generateRandomId() {
  const prefix = "DSP";
  const timestamp = Date.now().toString();
  return prefix + timestamp;
}

module.exports = {
  trainBooking,
  trainBookingUpdate,
};
