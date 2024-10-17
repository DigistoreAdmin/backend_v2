const axios = require("axios");
const catchAsync = require("../../utils/catchAsync");
const Wallet = require("../../db/models/wallet");
const AppError = require("../../utils/appError");
const transationHistory = require("../../db/models/transationhistory");
const Operator = require("../../db/models/operator");

const busStop = catchAsync(async (req, res) => {
  const response = await axios.post(
    `https://api.clubapi.in/bus/busStops.php?token=fbGl2ysaq1FTbJPEj4csnRrZIrWEol`
  );
  res.status(200).json(response.data);
});

const busList = catchAsync(async (req, res) => {
  const { sourceId, destinationId, journyDate } = req.body;

  const response = await axios.post(
    `https://api.clubapi.in/bus/busList.php?token=fbGl2ysaq1FTbJPEj4csnRrZIrWEol&sourceId=${sourceId}&destinationId=${destinationId}&journyDate=${journyDate}`
  );

  res.status(200).json(response.data);
});

const busSeatLayout = catchAsync(async (req, res) => {
  const { busId } = req.body;
  const response = await axios.post(
    `https://api.clubapi.in/bus/seatLayout.php?token=fbGl2ysaq1FTbJPEj4csnRrZIrWEol&busId=${busId}`
  );

  res.status(200).json(response.data);
});

const blockBusSeat = catchAsync(async (req, res) => {
  const { busId, bpId, dpId, customerMobile, passengerDetails } = req.body;
  const response = await axios.post(
    `https://api.clubapi.in/bus/blockSeat.php?token=fbGl2ysaq1FTbJPEj4csnRrZIrWEol&busId=${busId}&bpId=${bpId}&dpId=${dpId}&customerMobile=${customerMobile}&passengerDetails=${passengerDetails}`
  );

  res.status(200).json(response.data);
});

const bookBusSeat = catchAsync(async (req, res, next) => {
  const user = req.user;

  const {
    busBookedId,
    operatorId,
    amount,
    urid,
    phoneNumber,
    accountNo,
    SPKey,
  } = req.body;

  const franchiseData = await Franchise.findOne({
    where: { email: user.email },
  });

  if (!franchiseData) return next(new AppError("Franchise not found", 404));

  const walletData = await Wallet.findOne({
    where: { uniqueId: franchiseData.franchiseUniqueId },
  });

  if (!walletData) return next(new AppError("Wallet not found", 404));

  const result = await Operator.findOne({ where: { SP_key: SPKey } });

  // Check balance from RechAPI
  let rechapiBalance;
  try {
    const rechapiResponse = await axios.post(
      `https://api.clubapi.in/utility/balance.php?token=fbGl2ysaq1FTbJPEj4csnRrZIrWEol`
    );
    rechapiBalance = rechapiResponse.data.totalBuyerBal;
  } catch (error) {
    console.error("RechAPI balance fetch error:", error);
    return next(new AppError("Error fetching balance from RechAPI", 500));
  }

  // Balance validations
  if (amount > walletData.balance) {
    return next(new AppError("Insufficient wallet balance", 401));
  }
  if (amount > rechapiBalance) {
    return next(
      new AppError("Insufficient RechAPI balance. Contact administrator.", 401)
    );
  }

  // Book bus seat transaction
  let response;
  try {
    response = await axios.post(
      `https://api.clubapi.in/transaction.php?token=fbGl2ysaq1FTbJPEj4csnRrZIrWEol&busBookedId=${busBookedId}&operatorId=${operatorId}&amount=${amount}&urid=${urid}`
    );
  } catch (error) {
    console.error("Bus booking transaction error:", error);
    return next(new AppError("Error processing bus booking", 500));
  }

  const {
    status,
    data: { amount: responseAmount, orderId },
  } = response.data;

  if (status === "SUCCESS") {
    const totalCommissionAmount =
      result.commissionType === "percentage"
        ? (responseAmount * result.commission) / 100
        : result.commission;

    const adminCommissionAmount = totalCommissionAmount * 0.25;
    const franciseCommissionAmount = totalCommissionAmount * 0.75;

    const newBalance =
      Math.round(
        (walletData.balance - responseAmount + franciseCommissionAmount) * 100
      ) / 100;

    // Update wallet balance
    const updated = await Wallet.update(
      { balance: newBalance },
      { where: { uniqueId: franchiseData.franchiseUniqueId } }
    );

    console.log("updated: ", updated);

    // Record transaction history
    const newTransactionHistory = await transationHistory.create({
      transactionId: orderId,
      uniqueId: franchiseData.franchiseUniqueId,
      userName: franchiseData.franchiseName,
      userType: user.userType,
      service: result.rechargeType,
      customerNumber: phoneNumber,
      serviceNumber: accountNo,
      serviceProvider: result.serviceProvider,
      status: "success",
      amount: amount,
      franchiseCommission: franciseCommissionAmount,
      adminCommission: adminCommissionAmount,
      walletBalance: newBalance,
    });

    if (newTransactionHistory && updated) {
      return res
        .status(200)
        .json({ message: "Booking successful", data: response.data });
    }
  } else {
    await transationHistory.create({
      transactionId: orderId,
      uniqueId: franchiseData.franchiseUniqueId,
      userName: franchiseData.franchiseName,
      userType: user.userType,
      service: result.rechargeType,
      customerNumber: phoneNumber,
      serviceNumber: accountNo,
      serviceProvider: result.serviceProvider,
      status: "fail",
      amount: amount,
      walletBalance: walletData.balance,
    });

    return res
      .status(400)
      .json({ error: "Transaction failed. Try again later." });
  }
});

module.exports = {
  busList,
  busStop,
  busSeatLayout,
  blockBusSeat,
  bookBusSeat,
};
