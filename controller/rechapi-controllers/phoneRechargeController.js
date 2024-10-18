const Franchise = require("../../db/models/franchise");
const wallet = require("../../db/models/wallet");
// const rechapiOperators = require("../../db/models/rechapiOperators");
const catchAsync = require("../../utils/catchAsync");
const axios  = require("axios");
const AppError = require("../../utils/appError");
const transationHistories = require("../../db/models/transationhistory");

const phoneRecharge = catchAsync(async (req, res) => {
  const { phoneNumber, operatorId, amount } = req.body;

  const user = req.user;
  const Data = await Franchise.findOne({ where: { email: user.email } });

  const walletData = wallet.findOne({
    where: { uniqueId: Data.franchiseUniqueId },
  });
  console.log("15", walletData.balance);

  const result = await rechapiOperators.findOne({ where: { operatorId: operatorId } });

  if (!Data && !walletData && !result) {
    return next(new AppError("data not fetching", 401));
  }

  //   let token="fbGl2ysaq1FTbJPEj4csnRrZIrWEol"
  const rechapiBalance = await axios.post(
    "https://api.clubapi.in/utility/balance.php&token=fbGl2ysaq1FTbJPEj4csnRrZIrWEol"
  );
  console.log("16", rechapiBalance);

  if (amount > walletData.balance) {
    return next(
      new AppError("You don't have enough balance in your wallet", 401)
    );
  } else if (amount > rechapiBalance.data.balance) {
    return next(
      new AppError("Contact administrator if facing Problem again", 401)
    );
  }

  const random12DigitNumber = generateRandomNumber();
  let DSP = `DSP${random12DigitNumber}${Data.id}`;
  console.log("DSP", DSP);


  const response = await axios.post(`https://api.clubapi.in/utility/balance.php&token=fbGl2ysaq1FTbJPEj4csnRrZIrWEol&urid=${random12DigitNumber}&operatorId=${operatorId}&mobile=${phoneNumber}&amount=${amount}`)
  console.log("17",response.data)

  if(response.data.status ==="SUCCESS") {
    const totalCommissionAmount= result.commissionType==="percentage"? (response.data.amount * result.commission)/100 : result.commission;

    console.log("totalCommissionAmount", totalCommissionAmount)
    console.log("commissionAmount", result.commission)

    const adminCommissionAmount = totalCommissionAmount*0.25
    console.log("adminCommissionAmount",adminCommissionAmount)

    const franchiseCommissionAmount = totalCommissionAmount * 0.75
    console.log("franchiseCommissionAmount",franchiseCommissionAmount)

    let newBalance = walletData.balance - response.data.amount + franchiseCommissionAmount
    console.log("newBalance",newBalance)

    const updatedBalance= await wallet.update({balance:newBalance}, {where:{uniqueId:Data.franchiseUniqueId}})

    const transactionH=await transationHistories.create({
      transactionId: response.data.rpid,
      uniqueId: Data.franchiseUniqueId,
      userName: Data.franchiseName,
      userType: user.userType,
      service: result.serviceProvider,
      status: "success",
      amount: amount,
      franchiseCommission: franchiseCommissionAmount,
      adminCommission: adminCommissionAmount,
      walletBalance: newBalance,
    })

    if(updatedBalance && transactionH){
      return res
        .status(200)
        .json({ data: response.data, message: "recharge success" });
    }
  }
  else if(response.data.status==="PENDING"){
   const totalCommissionAmount= result.commissionType==="percentage"?(response.data.amount*result.commission)/100: result.commission
    console.log("commission",result.commission)
    console.log("totalCommissionAmount",totalCommissionAmount)

    const adminCommissionAmount = totalCommissionAmount*0.25
    console.log("adminCommissionAmount",adminCommissionAmount)

    const franchiseCommissionAmount = totalCommissionAmount * 0.75
    console.log("franchiseCommissionAmount",franchiseCommissionAmount)

    let newBalance = walletData.balance - response.data.amount + franchiseCommissionAmount
    console.log("newBalance",newBalance)

    const updatedBalance= await wallet.update({balance:newBalance}, {where:{uniqueId:Data.franchiseUniqueId}})

    const transactionH=await transationHistories.create({
      transactionId: response.data.rpid,
      uniqueId: Data.franchiseUniqueId,
      userName: Data.franchiseName,
      userType: user.userType,
      service: result.serviceProvider,
      status: "pending",
      amount: amount,
      franchiseCommission: franchiseCommissionAmount,
      adminCommission: adminCommissionAmount,
      walletBalance: newBalance,
    })

    if(updatedBalance && transactionH){
      return res
        .status(200)
        .json({ data: response.data, message: "recharge pending" });
    }

  }
  else{
    const transactionH=await transationHistories.create({
      transactionId: response.data.rpid,
      uniqueId: Data.franchiseUniqueId,
      userName: Data.franchiseName,
      userType: user.userType,
      service: result.serviceProvider,
      status: "fail",
      amount: amount,
      franchiseCommission: franchiseCommissionAmount,
      adminCommission: adminCommissionAmount,
      walletBalance: walletData.balance,
    })
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

module.exports = { phoneRecharge };
