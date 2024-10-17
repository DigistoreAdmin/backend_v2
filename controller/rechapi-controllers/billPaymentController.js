const { default: axios } = require("axios");
const Franchise = require("../../db/models/franchise");
const catchAsync = require("../../utils/catchAsync");
const wallets = require("../../db/models/wallet");
const transationHistories = require("../../db/models/transationhistory");

const fetchBill = catchAsync(async (req, res) => {
  const { operatorId, phoneNumber, mobile, bbpsId } = req.body;
  const user = req.user;
  const Data = await Franchise.findOne({ where: { email: user.email } });

  const randomDigit = fourDigitRandomNumberWithAlphabet();
  const urid = `${Data.franchiseUniqueId}${randomDigit}`;

  //fbGl2ysaq1FTbJPEj4csnRrZIrWEol
  const response = await axios.post(
    `https://api.clubapi.in/utility/balance.php&token=fbGl2ysaq1FTbJPEj4csnRrZIrWEol&mobile=${mobile}$bbpsId=${bbpsId}&trancType=billFetch&urid=${urid}&opvalue1=&opvalue2=&opvalue3=&opvalue4=&opvalue5=&phoneNumber=${phoneNumber}`
  );

  res.status(200).json(response.data);
});

const billPayment = catchAsync(async (req, res) => {
  const { amount, operatorId, bbpsId, phoneNumber, mobile } = req.body;
  const user = req.user;

  const Data = await Franchise.findOne({ where: { email: user.email } });
  const randomDigit = fourDigitRandomNumberWithAlphabet();
  const urid = `${Data.franchiseUniqueId}${randomDigit}`;

  const walletData = await wallets.findOne({
    where: { uniqueId: Data.franchiseUniqueId },
  });
  const result = await rechapiOperators.findOne({
    where: { operatorId: operatorId },
  });

  if (!Data && !walletData && !result) {
    return next(new AppError("Franchise not found", 404));
  }

  const rechapiBalance = await axios.post(
    "https://api.clubapi.in/utility/balance.php&token=fbGl2ysaq1FTbJPEj4csnRrZIrWEol"
  );
  console.log("17", rechapiBalance);

  if (amount > walletData.balance) {
    return next(
      new AppError("You don't have enough balance in your wallet", 401)
    );
  } else if (amount > rechapiBalance.data.balance) {
    return next(
      new AppError("Contact administrator if facing Problem again", 401)
    );
  }

  const response = await axios.post(
    `https://api.clubapi.in/transaction.php&token=fbGl2ysaq1FTbJPEj4csnRrZIrWEol`
  );
  console.log("res", response);

  if (response.data.status === "SUCCESS") {
    if (result.rechargeType == "Dth") {
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

      const updatedBalance = await wallets.update(
        { balance: newBalance },
        { where: { uniqueId: Data.franchiseUniqueId } }
      );
      console.log("updatedBalance", updatedBalance);

      const transactionH = await transationHistories.create({
        transactionId: response.data.orderId,
        uniqueId: Data.franchiseUniqueId,
        userName: Data.franchiseName,
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
    } else {
      const totalCommissionAmount =
        result.commissionType === "percentage"
          ? (response.data.amount * result.commission) / 100
          : result.commission;

      console.log("totalCommissionAmount", totalCommissionAmount);
      console.log("commissionAmount", result.commission);

      let newBalance =
        walletData.balance - response.data.amount + franchiseCommissionAmount;
      console.log("newBalance", newBalance);

      const updatedBalance = await wallets.update(
        { balance: newBalance },
        { where: { uniqueId: Data.franchiseUniqueId } }
      );
      console.log("updatedBalance", updatedBalance);

      const transactionH = await transationHistories.create({
        transactionId: response.data.orderId,
        uniqueId: Data.franchiseUniqueId,
        userName: Data.franchiseName,
        userType: user.userType,
        service: result.serviceProvider,
        status: "success",
        amount: amount,
        // franchiseCommission: franchiseCommissionAmount,
        adminCommission: totalCommissionAmount,
        walletBalance: newBalance,
      });
      console.log("transaction History checking working fine", transatinH);

      if (updatedBalance && transactionH) {
        res.status(200).json(response.data);
      }
    }
  } else if (response.data.status === "PENDING") {
    if (result.rechargeType == "Dth") {
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

      const updatedBalance = await wallets.update(
        { balance: newBalance },
        { where: { uniqueId: Data.franchiseUniqueId } }
      );
      console.log("updatedBalance", updatedBalance);

      const transactionH = await transationHistories.create({
        transactionId: response.data.orderId,
        uniqueId: Data.franchiseUniqueId,
        userName: Data.franchiseName,
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
          .json({ data: response.data, message: "recharge success" });
      }
    } else {
      const totalCommissionAmount =
        result.commissionType === "percentage"
          ? (response.data.amount * result.commission) / 100
          : result.commission;

      console.log("totalCommissionAmount", totalCommissionAmount);
      console.log("commissionAmount", result.commission);

      let newBalance =
        walletData.balance - response.data.amount + franchiseCommissionAmount;
      console.log("newBalance", newBalance);

      const updatedBalance = await wallets.update(
        { balance: newBalance },
        { where: { uniqueId: Data.franchiseUniqueId } }
      );
      console.log("updatedBalance", updatedBalance);

      const transactionH = await transationHistories.create({
        transactionId: response.data.orderId,
        uniqueId: Data.franchiseUniqueId,
        userName: Data.franchiseName,
        userType: user.userType,
        service: result.serviceProvider,
        status: "pending",
        amount: amount,
        // franchiseCommission: franchiseCommissionAmount,
        adminCommission: totalCommissionAmount,
        walletBalance: newBalance,
      });
      console.log("transaction History checking working fine", transatinH);

      if (updatedBalance && transactionH) {
        res.status(200).json(response.data);
      }
    }
  } else {
    if (!response.data.orderId) {
      return res
        .status(400)
        .json({ error: response.data, message: "Try Again Later" });
    }

    const transactionH = await transationHistories.create({
      transactionId: response.data.orderId,
      uniqueId: Data.franchiseUniqueId,
      userName: Data.franchiseName,
      userType: user.userType,
      service: result.serviceProvider,
      status: "fail",
      amount: amount,
      customerNumber: phoneNumber,
      // franchiseCommission: franchiseCommissionAmount,
      // adminCommission: adminCommissionAmount,
      walletBalance: walletData.balance,
    });
    if (transactionH) {
      return res
        .status(400)
        .json({ success: false, message: response.data.resText });
    }
  }
});

function randomAlphabet() {
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  return alphabet[Math.floor(Math.random() * alphabet.length)];
}

function fourDigitRandomNumberWithAlphabet() {
  const randomNumber = Math.floor(1000 + Math.random() * 9000); // Generates a 4-digit number
  const randomChar = randomAlphabet(); // Generates a random alphabet
  return randomChar + randomNumber.toString();
}

module.exports = { fetchBill, billPayment };
