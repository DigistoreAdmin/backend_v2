const Wallet = require("../db/models/wallet");
const Franchise = require("../db/models/franchise");
const TransactionHistory = require("../db/models/transationhistory");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

const bcrypt = require("bcrypt");

const updateFranchiseDetails = catchAsync(async (req, res, next) => {
  try {
    const {
      franchiseUniqueId,
      userType,
      ownerName,
      franchiseName,
      businessType,
      gender,
      dateOfBirth,
      franchiseAddressLine1,
      franchiseAddressLine2,
      state,
      district,
      pinCode,
      postOffice,
      panchayath,
      ward,
      digitalElements,
      panCenter,
      accountNumber,
      accountName,
      bank,
      branchName,
      ifscCode,
      aadhaarNumber,
      panNumber,
      referredBy,
      referredFranchiseName,
      referredFranchiseCode,
      onBoardedBy,
      onBoardedPersonId,
      onBoardedPersonName,
      userPlan,
    } = req.body;

    const franchise = await Franchise.findOne({
      where: { franchiseUniqueId },
    });

    if (!franchise) {
      return res
        .status(404)
        .json({ success: false, message: "Franchise not found" });
    }

    let hashPan;
    panNumber && typeof panNumber === "string"
      ? (hashPan = await bcrypt.hash(panNumber, 8))
      : panNumber;

    let hashAadhaar;
    aadhaarNumber && typeof aadhaarNumber === "number"
      ? (hashAadhaar = await bcrypt.hash(aadhaarNumber.toString(), 8))
      : aadhaarNumber;
    console.log("Hash", hashAadhaar);
    let hashAccountN;
    accountNumber && typeof accountNumber === "number"
      ? (hashAccountN = await bcrypt.hash(accountNumber.toString(), 8))
      : accountName;

    const updatedFranchise = await Franchise.update(
      {
        userType,
        ownerName,
        franchiseName,
        businessType,
        gender,
        dateOfBirth,
        franchiseAddressLine1,
        franchiseAddressLine2,
        state,
        district,
        pinCode,
        postOffice,
        panchayath,
        ward,
        digitalElements,
        panCenter,
        accountNumber: hashAccountN,
        accountName,
        bank,
        branchName,
        ifscCode,
        aadhaarNumber: hashAadhaar,
        panNumber: hashPan,
        referredBy,
        referredFranchiseName,
        referredFranchiseCode,
        onBoardedBy,
        onBoardedPersonId,
        onBoardedPersonName,
        userPlan,
      },
      {
        where: { franchiseUniqueId },
      }
    );

    if (!updatedFranchise) {
      throw new AppError("Failed to update the franchise", 400);
    }

    const updatedFranchises = await Franchise.findOne({
      where: { franchiseUniqueId },
    });

    return res.status(200).json({
      success: true,
      message: "Franchise details updated",
      updatedFranchises,
    });
  } catch (error) {
    console.error("Error:", error);
    return next(new AppError(error.message, 500));
  }
});

const updateWallet = catchAsync(async (req, res, next) => {
  try {
    const { uniqueId, amount } = req.body;
    // {"credit":500} or {"debit":500} - amount

    const wallet = await Wallet.findOne({
      where: { uniqueId },
    });

    const transactionHistory = await TransactionHistory.findOne({
      where: { uniqueId },
    });

    const franchise = await Franchise.findOne({
      where: { franchiseUniqueId: uniqueId },
    });

    if (!wallet && !transactionHistory && !franchise) {
      return next(new AppError("Franchise not found", 404));
    }

    const random12DigitNumber = generateRandomNumber();
    let DSP = `DSP${random12DigitNumber}${franchise.id}`;

    const sum = (a, b) => {
      return (parseFloat(a) + parseFloat(b)).toFixed(2);
    };
    const sub = (a, b) => {
      return (parseFloat(a) - parseFloat(b)).toFixed(2);
    };

    let amountValue = JSON.parse(amount);
    let credited =
      amountValue.credit && sum(wallet.balance, amountValue.credit);
    let debited = amountValue.debit && sub(wallet.balance, amountValue.debit);
    let servicez = "";
    credited
      ? (servicez = "wallet credited by admin")
      : (servicez = "wallet debited by admin");

    console.log("balance", wallet.balance);
    console.log("updated balance", credited, debited);

    const updatedW = await Wallet.update(
      { balance: credited || debited },
      { where: { uniqueId: wallet.uniqueId } }
    );

    const transactionH = await TransactionHistory.create(
      {
        transactionId: DSP,
        uniqueId: franchise.franchiseUniqueId,
        userName: franchise.franchiseName,
        userType: franchise.userType,
        service: servicez,
        amount: amountValue.credit || amountValue.debit,
        walletBalance: credited || debited,
        status: "success",
      },
      { where: { uniqueId: uniqueId } }
    );

    if (updatedW && transactionH) {
      res.status(200).json({
        success: true,
        message: "amount updated success",
        updatedH: transactionH,
        updatedW: updatedW,
      });
    }
  } catch (error) {
    console.error("Error:", error);
    return next(new AppError(error.message, 500));
  }
});

function generateRandomNumber() {
  const randomNumber =
    Math.floor(Math.random() * (999999999999 - 100000000000 + 1)) +
    100000000000;
  return randomNumber.toString();
}

module.exports = { updateFranchiseDetails, updateWallet };
