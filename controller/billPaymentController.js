const { Sequelize } = require("sequelize");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const sms = require("../config/sms");
const mail = require("../config/emailOtp");
const Franchise = require("../db/models/franchise");
const userPlans = require("../db/models/userplan");
const Operator = require("../db/models/operator");
const Tokens = require("../utils/token");
const axios = require("axios");
const Wallet = require("../db/models/wallet");

const defineMoneyTransferDetails = require("../db/models/moneytransferdetails");
const dmtUserData = require("../db/models/dmtuserdata");
const user = require("../db/models/user");
const { generateOTP, sendOTP } = require("../utils/otpUtils");
const transationHistory = require("../db/models/transationhistory");
const transationHistories = require("../db/models/transationhistory");
const sequelize = require("../config/database");
// const se = sequelize.produc

// const generateToken = (payload) => {
//   return jwt.sign(payload, process.env.JWT_SECRET_KEY, {
//     expiresIn: process.env.JWT_EXPIRES_IN,
//   });
// };
const Circles = require("../db/models/circle");

const fetchBill = catchAsync(async (req, res, next) => {
  const { SPKey, phoneNumber, accountNo } = req.body;

  console.log("ll");

  const random12DigitNumber = generateRandomNumber();
  console.log("ra", random12DigitNumber);

  const response = await axios.get(
    `https://livepay.co.in/API/FetchBill?UserId=2955&Token=a3c538a805fdd227025b84aa7d59ff7b&Account=${accountNo}&Amount=0&SPKey=${SPKey}&APIRequestID=${random12DigitNumber}&Optional1=&Optional2=&Optional3=&Optional4=&GEOCode=23.8530,87.9727&CustomerNumber=${phoneNumber}&Pincode=743329&Format=1&OutletID=12345`
  );

  console.log("res data", response.data);
  res.status(200).json(response.data);
});

const billPaymentRequest = catchAsync(async (req, res, next) => {
  const { fetchBillID, amount, SPKey, phoneNumber, accountNo } = req.body;
  const user = req.user;

  const Data = await Franchise.findOne({ where: { email: user.email } });

  const walletData = await Wallet.findOne({ where: { uniqueId: Data.franchiseUniqueId } });
  const result = await Operator.findOne({ where: { SP_key: SPKey } });
  console.log(walletData.balance);
  if (!Data && !walletData && !result) {
    return next(new AppError('Franchise not found', 404));
  }

  const livePayBalance = await axios.get(
    `https://www.livepay.co.in/API/Balance?UserID=2955&Token=a3c538a805fdd227025b84aa7d59ff7b&Format=1&OutletID=999`
  );
  console.log("livePayBalance", livePayBalance);

  if (amount > walletData.balance) {
    return next(new AppError("you don't have enough money in you wallet", 401));
  } else if (amount > livePayBalance.data.bal) {
    return next(
      new AppError("Contact administrator if facing Problem again", 401)
    );
  }

  const random12DigitNumber = generateRandomNumber();
  let DSP = `DSP${random12DigitNumber}${Data.id}`;
  console.log("DSP", DSP);
  console.log("ra", random12DigitNumber);

  const response = await axios.get(
    `https://www.livepay.co.in/API/TransactionAPI?UserID=2955&Token=a3c538a805fdd227025b84aa7d59ff7b&Account=${accountNo}&Amount=${amount}&SPKey=${SPKey}&APIRequestID=${random12DigitNumber}&Optional1=&Optional2=&Optional3=&Optional4=&GEOCode=18.4099808,76.5834877&CustomerNumber=${phoneNumber}&Pincode=691536&FetchBillID=${fetchBillID}&Format=1&OutletID=12345`
  );
  console.log("res", response);
  if (
    response.data.status === 2 &&
    response.data.msg === "SUCCESS" &&
    response.data.opid
  ) {
    
    // commission
        
    if (result.rechargeType=="Dth") {
      
      const totalCommissionAmount =
        result.commissionType === "percentage"
          ? (response.data.amount * result.commission) / 100
          : result.commission;
  
      console.log("commission", result.commission);
  
      console.log("toralCommittion", totalCommissionAmount);
      const adminCommissionAmount = totalCommissionAmount * 0.25;
  
      console.log("adminCommissionAmount", adminCommissionAmount);
      const franciseCommissionAmount = totalCommissionAmount * 0.75;
      console.log("franchiseCommission", franciseCommissionAmount);
  
      let newBalance =
        walletData.balance - response.data.amount + franciseCommissionAmount;
        console.log("newBalance", newBalance);
        
        const updated = await Wallet.update(
          { balance: newBalance },
          { where: { uniqueId: Data.franchiseUniqueId } }
        );
        console.log("updatedBalance", updated);
        const serr = `Recharge Number or Id:${phoneNumber} serviceProvider:${result.serviceProvider}`;

        const transatinH = await transationHistory.create({
          transactionId: DSP,
          uniqueId: Data.franchiseUniqueId,
          userName: Data.franchiseName,
          userType: user.userType,
          service: serr,
          status: "success",
          typeOfTransation:"debit",
          amount: amount,
          franchiseCommission: franciseCommissionAmount,
          adminCommission: adminCommissionAmount,
          walletBalance: newBalance,
        });
    
        console.log("transatin History checking working fine", transatinH);
    
        if (updated && transatinH) {
          res.status(200).json(response.data);
        }
              // commission
    }else{
        // const franciseCommissionAmount = 0.00
        // const adminCommissionAmount = 0.00
      let newBalance = walletData.balance - response.data.amount
      const updated = await Wallet.update(
        { balance: newBalance },
        { where: { uniqueId: Data.franchiseUniqueId } }
      );
      console.log("updatedBalance", updated);

      const serr = `Recharge Number or Id:${phoneNumber} serviceProvider:${result.serviceProvider}`;

      const transatinH = await transationHistory.create({
        transactionId: DSP,
        uniqueId: Data.franchiseUniqueId,
        userName: Data.franchiseName,
        userType: user.userType,
        service: serr,
        status: "success",
        amount: amount,
        // franchiseCommission: franciseCommissionAmount,
        // adminCommission: adminCommissionAmount,
        walletBalance: newBalance,
      });
  
      console.log("transatin History checking working fine", transatinH);
  
      if (updated && transatinH) {
        res.status(200).json(response.data);
      }
    }
      //

  } else {
    const serr = `Recharge Number or Id:${phoneNumber} serviceProvider:${result.serviceProvider}`;
    const transatinH = await transationHistory.create({
      transactionId: DSP,
      uniqueId: Data.franchiseUniqueId,
      userName: Data.franchiseName,
      userType: user.userType,
      service: serr,
      status: "fail",
      amount: amount,
      // franchiseCommission: franciseCommissionAmount,
      // adminCommission: adminCommissionAmount,
      walletBalance: walletData.balance,
    });
    if (transatinH) {
      return res
      .status(400)
      .json({ success: false, message: "Operation failed" });
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
  fetchBill,
  billPaymentRequest,
};