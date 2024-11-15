const axios = require("axios");
const catchAsync = require("../../utils/catchAsync");
const Wallet = require("../../db/models/wallet");
const AppError = require("../../utils/appError");
const transationHistory = require("../../db/models/transationhistory");
const Operator = require("../../db/models/operator");
const Franchise = require("../../db/models/franchise");

const flightAirports = catchAsync(async (req, res) => {
  const response = await axios.post(
    `https://api.clubapi.in/flight/airports.php?token=fbGl2ysaq1FTbJPEj4csnRrZIrWEol`
  );

  res.status(200).json(response.data);
});

const flightList = catchAsync(async (req, res) => {
  const response = await axios.post(
    `https://api.clubapi.in/flight/flightList.php?token=fbGl2ysaq1FTbJPEj4csnRrZIrWEol`
  );

  res.status(200).json(response.data);
});

const flightDetails = catchAsync(async (req, res) => {
  const response = await axios.post(
    `https://api.clubapi.in/flight/flightDetails.php?token=fbGl2ysaq1FTbJPEj4csnRrZIrWEol`
  );

  res.status(200).json(response.data);
});

const flightLatestFair = catchAsync(async (req, res) => {
  const response = await axios.post(
    `https://api.clubapi.in/flight/getFareDetails.php?token=fbGl2ysaq1FTbJPEj4csnRrZIrWEol`
  );
  res.status(200).json(response.data);
});

const blockFlight = catchAsync(async (req, res) => {
  const response = await axios.post(
    `https://api.clubapi.in/flight/blockTicket.php?token=fbGl2ysaq1FTbJPEj4csnRrZIrWEol`
  );
  res.status(200).json(response.data);
});

const bookFlightTicket = catchAsync(async (req, res) => {
  const { amount, flightBookedId } = req.body;
  const user = req.user;

  const franchiseData = await Franchise.findOne({
    where: { email: user.email },
  });

  const walletData = await Wallet.findOne({
    where: { uniqueId: franchiseData.franchiseUniqueId },
  });
  console.log("walletBalance", walletData.balance);

  const result = await Operator.findOne({ where: { operatorId: operatorId } });

  if (!franchiseData && !walletData && !result) {
    return next(new AppError("data not fetching", 401));
  }

  const rechapiBalance = await axios.post(
    "https://api.clubapi.in/utility/balance.php?token=fbGl2ysaq1FTbJPEj4csnRrZIrWEol"
  );
  console.log("rechapiBalance", rechapiBalance);

  // Balance validations
  if (amount > walletData.balance) {
    return next(new AppError("Insufficient wallet balance", 401));
  }
  if (amount > rechapiBalance) {
    return next(
      new AppError("Insufficient RechAPI balance. Contact administrator.", 401)
    );
  }

  const random12DigitNumber = generateRandomNumber();
  const urid = `DSP${random12DigitNumber}${Data.id}`;
  console.log("DSP", urid);

  const operatorId = 746 

  const response = await axios.post(
    `https://api.clubapi.in/transaction.php?token=fbGl2ysaq1FTbJPEj4csnRrZIrWEol&flightBookedId=${flightBookedId}&operatorId=${operatorId}&amount=${amount}&urid=${urid}`
  );

  if (response.data.status === "SUCCESS") {
    const totalCommissionAmount =
      result.commissionType === "percentage"
        ? (response.data.amount * result.commission) / 100
        : result.commission;

    console.log("totalCommissionAmount", totalCommissionAmount);
    console.log("commissionAmount", result.commission);

    const adminCommissionAmount = totalCommissionAmount * 0.25;
    console.log("adminCommissionAmount", adminCommissionAmount);

    const franchiseCommissionAmount = totalCommissionAmount * 0.75;
    console.log("franchiseCommissionAmount", franchiseCommissionAmount);

    let newBalance =
      walletData.balance - response.data.amount + franchiseCommissionAmount;
    console.log("newBalance", newBalance);

    const updatedBalance = await Wallet.update(
      { balance: newBalance },
      { where: { uniqueId: franchiseData.franchiseUniqueId } }
    );

    const transactionH = await transationHistory.create({
      transactionId: response.data.transId,
      uniqueId: franchiseData.franchiseUniqueId,
      userName: franchiseData.franchiseName,
      userType: user.userType,
      service: result.serviceProvider,
      status: "success",
      amount: amount,
      franchiseCommission: franchiseCommissionAmount,
      adminCommission: adminCommissionAmount,
      walletBalance: newBalance,
    });

    if (updatedBalance && transactionH) {
      return res
        .status(200)
        .json({ data: response.data, message: "recharge success" });
    }
  } else if (response.data.status === "PENDING") {
    const totalCommissionAmount =
      result.commissionType === "percentage"
        ? (response.data.amount * result.commission) / 100
        : result.commission;
    console.log("commission", result.commission);
    console.log("totalCommissionAmount", totalCommissionAmount);

    const adminCommissionAmount = totalCommissionAmount * 0.25;
    console.log("adminCommissionAmount", adminCommissionAmount);

    const franchiseCommissionAmount = totalCommissionAmount * 0.75;
    console.log("franchiseCommissionAmount", franchiseCommissionAmount);

    let newBalance =
      walletData.balance - response.data.amount + franchiseCommissionAmount;
    console.log("newBalance", newBalance);

    const updatedBalance = await Wallet.update(
      { balance: newBalance },
      { where: { uniqueId: franchiseData.franchiseUniqueId } }
    );

    const transactionH = await transationHistory.create({
      transactionId: response.data.transId,
      uniqueId: franchiseData.franchiseUniqueId,
      userName: franchiseData.franchiseName,
      userType: user.userType,
      service: result.serviceProvider,
      status: "pending",
      amount: amount,
      franchiseCommission: franchiseCommissionAmount,
      adminCommission: adminCommissionAmount,
      walletBalance: newBalance,
    });

    if (updatedBalance && transactionH) {
      return res
        .status(200)
        .json({ data: response.data, message: "recharge pending" });
    }
  } else {
    const transactionH = await transationHistory.create({
      transactionId: response.data.transId,
      uniqueId: franchiseData.franchiseUniqueId,
      userName: franchiseData.franchiseName,
      userType: user.userType,
      service: result.serviceProvider,
      status: "fail",
      amount: amount,
      franchiseCommission: franchiseCommissionAmount,
      adminCommission: adminCommissionAmount,
      walletBalance: walletData.balance,
    });
    if (transactionH) {
      return res
        .status(400)
        .json({ error: response.data, message: "Operation failed" });
    }
  }
});

function generateRandomNumber() {
  const randomNumber =
    Math.floor(Math.random() * (999999999999 - 100000000000 + 1)) +
    100000000000;
  return randomNumber.toString();
}

module.exports = {
  flightAirports,
  flightList,
  flightDetails,
  blockFlight,
  flightLatestFair,
  bookFlightTicket,
};
