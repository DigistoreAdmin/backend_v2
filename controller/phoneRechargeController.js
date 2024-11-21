const { Sequelize } = require("sequelize");

// const Contact = require("../db/models/contact");
// const OTP = require("../db/models/otp");
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
const Circles = require("../db/models/circle");




const mobileRecharge = catchAsync(async (req, res, next) => {
  const { phoneNumber, sp_key, circle, amount } = req.body;

  const user = req.user;
  const Data = await Franchise.findOne({ where: { email: user.email } });

  const walletData = await Wallet.findOne({ where: { uniqueId: Data.franchiseUniqueId } });
  console.log(walletData.balance);
  const result = await Operator.findOne({ where: { SP_key: sp_key } });

  if (!Data && !walletData && !result) {
    return next(new AppError("data not fetching", 401));
  }

  const livePayBalance = await axios.get(
    `https://www.livepay.co.in/API/Balance?UserID=2955&Token=a3c538a805fdd227025b84aa7d59ff7b&Format=1&OutletID=999`
  );
  console.log("livePayBalance", livePayBalance);
  console.log("livePayBalance.....", livePayBalance.data.bal);

  if (amount > walletData.balance) {
    return next(new AppError("you don't have enough money in you wallet", 401));
  } else if (amount > livePayBalance.data.bal) {
    return next(
      new AppError("Contact administrator if facing Problem again", 401)
    );
  }

  const randomDigitNumber = fourDigitRandomNumberWithAlphabet()
  const apiRequestId = `${Data.franchiseUniqueId}${randomDigitNumber}`

  const response = await axios.get(
    `https://livepay.co.in/API/TransactionAPI?UserID=2955&Token=a3c538a805fdd227025b84aa7d59ff7b&Account=${phoneNumber}&Amount=${amount}&SPKey=${sp_key}&APIRequestID=${apiRequestId}&Optional1={Optional1}&Optional2={Optional2}&Optional3={Optional3}&Optional4={Optional4}&RefID={RefID}&GEOCode=${circle}&CustomerNumber=8606172833&Pincode=691536&Format=1&OutletID=0`
  );
  console.log("res ", response);
  console.log("res ", response.data.rpid);// transation id in history
  console.log("res status", response.status);
  console.log("res amount", response.data.amount);
  console.log("res statusText", response.statusText);
  if (
    response.data.status === 2 &&
    response.data.msg === "SUCCESS" &&
    response.data.opid
  ) {
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
      newBalance = Math.round(newBalance * 100) / 100;
    console.log("newBalance", newBalance);

    const updated = await Wallet.update(
      { balance: newBalance },
      { where: { uniqueId: Data.franchiseUniqueId } }
    );
    console.log("updatedBalance", updated);
    const serr = `Mobile Recharge Number:${phoneNumber} sim:${result.serviceProvider}`;

    const transatinH = await transationHistory.create({
      transactionId: response.data.rpid,
      uniqueId: Data.franchiseUniqueId,
      userName: Data.franchiseName,
      userType: user.userType,
      service: result.rechargeType,
      customerNumber:phoneNumber,
      serviceNumber:phoneNumber,
      serviceProvider:result.serviceProvider,
      status: "success",
      amount: amount,
      franchiseCommission: franciseCommissionAmount,
      adminCommission: adminCommissionAmount,
      walletBalance: newBalance,
    });

    // console.log("transatin History checking working fine", transatinH);

    if (updated && transatinH) {
      return res
        .status(200)
        .json({ data: response.data, message: "recharge success" });
    }
  } else if (
    response.data.status === 1 &&
    response.data.msg === "PENDING" 
  ) 
    {
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
      newBalance = Math.round(newBalance * 100) / 100;
    console.log("newBalance", newBalance);

    const updated = await Wallet.update(
      { balance: newBalance },
      { where: { uniqueId: Data.franchiseUniqueId } }
    );
    console.log("updatedBalance", updated);
    const serr = `Mobile Recharge Number:${phoneNumber} sim:${result.serviceProvider}`;

    const transatinH = await transationHistory.create({
      transactionId: response.data.rpid,
      uniqueId: Data.franchiseUniqueId,
      userName: Data.franchiseName,
      userType: user.userType,
      service: result.rechargeType,
      customerNumber:phoneNumber,
      serviceNumber:phoneNumber,
      serviceProvider:result.serviceProvider,
      status: "pending",
      amount: amount,
      franchiseCommission: franciseCommissionAmount,
      adminCommission: adminCommissionAmount,
      walletBalance: newBalance,
    });

    if (updated && transatinH) {
      return res
        .status(200)
        .json({ data: response.data, message: "Recharge Processing" });
    }
    } 
   else 
   {
    //
    if (!response.data.rpid) {
      return res
        .status(400)
        .json({ error: response.data, message: "Try Again Later" });
    }
     const serr = `Mobile Recharge Number:${phoneNumber} sim:${result.serviceProvider}`;
    const transatinH = await transationHistory.create({
      transactionId: response.data.rpid,
      uniqueId: Data.franchiseUniqueId,
      userName: Data.franchiseName,
      userType: user.userType,
      status: "fail",
      service: result.rechargeType,
      customerNumber:phoneNumber,
      serviceNumber:phoneNumber,
      serviceProvider:result.serviceProvider,
      amount: amount,
      walletBalance: walletData.balance,
    });
    if (transatinH) {
      return res
        .status(400)
        .json({ error: response.data, message: "Something Went Wrong" });
    }
  }
});


const callBackUrl = catchAsync(async (req, res, next) => {
  const { STATUS, MOBILE, AMOUNT, TRANID, AGENTID, LIVEID, MSG } = req.query;

  // Log all the parameters
  console.log("STATUS:", STATUS);
  console.log("MOBILE:", MOBILE);
  console.log("AMOUNT:", AMOUNT);
  console.log("TRANID:", TRANID); //
  console.log("AGENTID:", AGENTID);
  console.log("LIVEID:", LIVEID);
  console.log("MSG:", MSG);
  
  const data = await transationHistory.findOne({ where: { transactionId:TRANID } });
  console.log("data:", data);
  console.log("data.status:", data.status);//

  if (data.status=="pending" && STATUS==2) {
    const update = await transationHistory.update({ status:"success" },{where:{transactionId:TRANID}})
    console.log("121",update);
    
  }else if (data.status=="pending" && STATUS==3) {
    console.log("uniqueId",data.uniqueId);
    // d = data.uniqueId
    const amount = await Wallet.findOne({ where: { uniqueId:data.uniqueId } })
    // let newBalance = AMOUNT + amount.balance - data.franchiseCommission
    const transaction = await transationHistory.findOne({where: {transactionId: TRANID}});
    
      let newBalance = transaction.service === "Prepaid" || transaction.service === "Postpaid" || transaction.service === "Dth" 
    ? Number(AMOUNT) + Number(amount.balance) - Number(data.franchiseCommission) 
    : Number(AMOUNT) + Number(amount.balance);
      // let newBalance = Number(AMOUNT) + Number(amount.balance) - Number(data.franchiseCommission);
      newBalance = Math.round(newBalance * 100) / 100;
      const update = await transationHistory.update({ status:"fail", amount: AMOUNT,adminCommission: 0.00, franchiseCommission: 0.00, walletBalance: newBalance  },{where:{transactionId:TRANID}})
      console.log("121",update);
      console.log("newBalance",newBalance);
      
      const updated = await Wallet.update(
        { balance: newBalance },
        { where: {uniqueId:data.uniqueId} }
      );
      console.log(updated);
    
  }
  
})






function randomAlphabet() {
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  return alphabet[Math.floor(Math.random() * alphabet.length)];
}

function fourDigitRandomNumberWithAlphabet() {
  const randomNumber = Math.floor(1000 + Math.random() * 9000); // Generates a 4-digit number
  const randomChar = randomAlphabet(); // Generates a random alphabet
  return randomChar + randomNumber.toString();
}


module.exports = {
  mobileRecharge,
  callBackUrl
};
