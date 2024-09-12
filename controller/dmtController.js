const { Sequelize } = require("sequelize");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const Franchise = require("../db/models/franchise");
const axios = require("axios");
const Wallet = require("../db/models/wallet");
const transationHistory = require("../db/models/transationhistory");
const dmtUserData = require("../db/models/dmtuserdata");
const user = require("../db/models/user");
const sequelize = require("../config/database");

var ra;
const DMTsendOtp = catchAsync(async (req, res, next) => {
  const random12DigitNumber = generateRandomNumber();
  ra = random12DigitNumber;
  const body = req.body;
  const credentials = req.externalServiceData;
  console.log("Request body:", body);
  console.log("Encoded credentials:", credentials);

  try {
    const response = await axios.post(
      "https://services.bankit.in:8443/DMR/generic/otp",
      {
        agentCode: random12DigitNumber,
        customerId: body.phoneNumber,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: credentials,
        },
      }
    );
    console.log("Responseeeeeeeeeeeeeeeeeeeeeeeee:", response.data.errorMsg);
    // console.log("Response data:", response.data);
    res.status(200).json(response.data);
  } catch (error) {
    if (error.response) {
      console.error(
        "Error response:",
        error.response.status,
        error.response.data
      );
      res.status(error.response.status).json(error.response.data);
    } else if (error.request) {
      console.error("Error request:", error.request);
      res
        .status(500)
        .json({ message: "No response received from external service." });
    } else {
      console.error("Error message:", error.message);
      res.status(500).json({ message: "An unknown error occurred." });
    }
  }
});

const DMTuserCreate = catchAsync(async (req, res, next) => {
  const body = req.body;
  const user = req.user;
  const credentials = req.externalServiceData;
  console.log(body.phoneNumber);

  if (!body) {
    throw new AppError("enter all the details", 400);
  }

  console.log("mmmmmmmmmm", ra);
  const response = await axios.post(
    "https://services.bankit.in:8443/DMR/customer/create?",
    {
      agentCode: ra,
      customerId: body.phoneNumber,
      name: body.name,
      address: body.address,
      dateOfBirth: body.dateOfBirth,
      otp: body.otp,
    },
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: credentials,
      },
    }
  );
  console.log("Response:", response.data);
  // }
  if (response) {
    return res.status(200).json(response.data);
    // return res.status(201).json({response.data,
    //   status: "success"
    // });
  } else {
    console.log("fail");
  }
});

const DMTuserFetch = catchAsync(async (req, res, next) => {
  const body = req.body;
  const user = req.user;
  const credentials = req.externalServiceData;

  console.log("raaaaaaaaaaa", ra);

  const response = await axios.post(
    "https://services.bankit.in:8443/DMR/customer/v1/fetch?",
    {
      agentCode: ra,
      customerId: body.phoneNumber,
    },
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: credentials,
      },
    }
  );
  // console.log("res", response);
  if (response) {
    return res.status(200).json(response.data);
  }
});

const DMTfetchAllRecipientsOfUser = catchAsync(async (req, res, next) => {
  const body = req.body;
  const user = req.user;
  const credentials = req.externalServiceData;

  const response = await axios.post(
    "https://services.bankit.in:8443/DMRV1.1/recipient/fetchAll?",
    {
      agentCode: ra,
      customerId: body.phoneNumber,
    },
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: credentials,
      },
    }
  );
  // console.log("res", response);
  if (response) {
    return res.status(200).json(response.data);
  }
});

const DMTaddBeneficery = catchAsync(async (req, res, next) => {
  const body = req.body;
  const user = req.user;
  const credentials = req.externalServiceData;

  const response = await axios.post(
    "https://services.bankit.in:8443/DMR/recipient/add?",
    {
      agentCode: ra,
      bankName: body.bankName,
      customerId: body.phoneNumber,
      accountNo: body.accountNo,
      ifsc: body.ifsc,
      mobileNo: body.mobileNo,
      recipientName: body.recipientName,
    },
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: credentials,
      },
    }
  );
  // console.log("Response:", response.data);
  // }
  if (response) {
    return res.status(200).json(response.data);
  } else {
    console.log("fail");
  }
});

const DMTfetchSingleBeneficery = catchAsync(async (req, res, next) => {
  const body = req.body;
  const user = req.user;
  const credentials = req.externalServiceData;

  const response = await axios.post(
    "https://services.bankit.in:8443/DMR/recipient/fetch?",
    {
      agentCode: ra,
      customerId: body.phoneNumber,
      recipientId: body.recipientId,
    },
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: credentials,
      },
    }
  );
  // console.log("Response:", response.data);
  // }
  if (response) {
    return res.status(200).json(response.data);
  } else {
    console.log("fail");
  }
});

const DMTdeleteBeneficery = catchAsync(async (req, res, next) => {
  const body = req.body;
  const user = req.user;
  const credentials = req.externalServiceData;
  const response = await axios.post(
    "https://services.bankit.in:8443/DMR/recipient/delete?",
    {
      agentCode: ra,
      customerId: body.phoneNumber,
      recipientId: body.recipientId,
    },
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: credentials,
      },
    }
  );
  // console.log("Response:", response.data);
  // }
  if (response) {
    return res.status(200).json(response.data);
  } else {
    console.log("fail");
  }
});

const DMTremitAPI = catchAsync(async (req, res, next) => {
  const body = req.body;
  const user = req.user;
  const credentials = req.externalServiceData;

  const Data = await Franchise.findOne({ where: { email: user.email } });

  const walletData = await Wallet.findOne({
    where: { uniqueId: Data.franchiseUniqueId },
  });
  console.log("walletDataBalance", walletData.balance);

  if (!body.amount && !body.phoneNumber && !body.recipientId) {
    console.log("iiiiiiiiiiiiiii");
    return next(new AppError("datas not provided", 401));
  }
  if (!Data && !walletData) {
    return next(new AppError("data not fetching", 401));
  }
  const down = await axios.get(
    "https://services.bankit.in:8443/DMRV1.1/generic/bankDown",
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: credentials,
      },
    }
  );
  console.log("down", down.data);
  down.data.forEach((bank) => {
    if (bank.bankName == body.bankName) {
      return next(new AppError("Bank is down", 401));
    }
  });
  if (body.amount < 100) {
    return next(new AppError("Minimum Transation Amount Is RS.100", 401));
  }
  const calculation = calculateTransactionShares(body.amount);
  console.log("calculation", calculation);
  console.log("calculation transactionAmounts", calculation.transactionAmounts);
  console.log("calculation remainingAmount", calculation.remainingAmount);

  const DMTwalletBalance = await axios.get(
    "https://services.bankit.in:8443/DMR/generic/balance",
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: credentials,
      },
    }
  );
  //  console.log("DMTwalletBalance",DMTwalletBalance);
  console.log("DMTwalletBalance .apibalance", DMTwalletBalance.data.apibalance);

  if (calculation.transactionAmounts > walletData.balance) {
    return next(
      new AppError(
        "you don't have enough money including service charge in you wallet",
        401
      )
    );
  } else if (body.amount > DMTwalletBalance.data.apibalance) {
    return next(
      new AppError("Contact administrator if facing Problem again", 401)
    );
  }

  if (
    calculation.remainingAmount < 100 &&
    calculation.remainingAmount != null
  ) {
    return next(
      new AppError(
        `you can only transfer a round figure ${
          body.amount + (100 - calculation.remainingAmount)
        } OR ${body.amount - calculation.remainingAmount}`,
        401
      )
    );
  }
  //dmt balance
  //bank down check
  const logArray = [];
  for (let index = 1; index <= calculation.count; index++) {
    if (calculation.remainingAmount != null) {
      AMT = index == calculation.count ? calculation.remainingAmount : 5000;
    } else {
      AMT = body.amount;
    }
    const random12DigitNumber =  generateRandomNumber15();
    raNo = `10174${random12DigitNumber}`;
    console.log("rrrrrrrrrr", raNo);
    try {
      const response = await axios.post(
        "https://services.bankit.in:8443/DMR/transact/IMPS/v1/remit/?",
        {
          agentCode: ra,
          recipientId: body.recipientId,
          customerId: body.phoneNumber,
          amount: AMT,
          clientRefId: raNo,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: credentials,
          },
        }
      );

      console.log("Response::::::::0", response.data);
      console.log("Response 1", response.config);

      const requestData = JSON.parse(response.config.data);
      console.log("response.amount ", requestData.amount);
      console.log("response.customerId", response.data.data.customerId);

      response.data.errorMsg == "Success"
        ? logArray.push({
            dmtTransationId: response.data.data.clientRefId,
            errorMsg: response.data.errorMsg,
            amount: AMT,
            customerId: response.data.data.customerId,
            success: response.data.errorMsg === "Success", // Assuming "SUCCESS" is the success message
          })
        : logArray.push({
            dmtTransationId: response.data.data.clientRefId,
            errorMsg: response.data.errorMsg,
            amount: AMT,
            customerId: body.phoneNumber,
            success: false,
          });
    } catch (error) {
      console.error("Error:", error.message);
    }
  }
  let successCount = 0;let failureCount = 0;let successAmount = 0;let failureAmount = 0;let successIds = [];let failureIds = [];

  logArray.forEach((log) => {
    if (log.success) {
      successCount++;
      successAmount += log.amount;
      successIds.push(log.dmtTransationId);
    } else {
      failureCount++;
      failureAmount += log.amount;
      failureIds.push(log.dmtTransationId);
    }
  });
  console.log("Success Count:", successCount);
  console.log("Failure Count:", failureCount);
  console.log("Total Success Amount:", successAmount);
  console.log("Total Failure Amount:", failureAmount);
  console.log(`Success Transaction IDs: ${successIds.join(", ")}`);
  console.log(`Failure Transaction IDs: ${failureIds.join(", ")}`);

  // if (response.data.errorMsg == Success && response.data.errorCode == "00" ) {

  if (successAmount > 0 || failureAmount > 0) {
    const cal = calculateTransactionShares(successAmount);
    let newBalance = walletData.balance - successAmount - cal.serviceCharge + cal.totalFranchiseShare;

    console.log("walletData.balance", walletData.balance);
    console.log("successAmount", successAmount);
    console.log("cal.serviceCharge", cal.serviceCharge);
    console.log("cal.totalFranchiseShare", cal.totalFranchiseShare);
    console.log("newBalance", newBalance);

    const updated = await Wallet.update({ balance: newBalance },{ where: { uniqueId: Data.franchiseUniqueId } });
    console.log("updatedBalance", updated);

    const random12DigitNumber = generateRandomNumber();
    let DSP = `DSP${random12DigitNumber}${Data.id}`;
    console.log("DSP", DSP);

    const serr = `DMT coustomerNo.${body.phoneNumber} SuccessAmount:${successAmount} FailedAmount:${failureAmount} Total Amount try to send:${body.amount}`;
    // const serr = `DMT successA sim:${result.serviceProvider}`;
    const transatinH = await transationHistory.create({
      transactionId: DSP,
      uniqueId: Data.franchiseUniqueId,
      userName: Data.franchiseName,
      userType: user.userType,
      service: serr,
      status: successAmount == 0 ? "fail" : "success",
      amount: successAmount == 0 ? failureAmount : successAmount,
      franchiseCommission: cal.totalFranchiseShare,
      adminCommission: cal.totalAdminShare,
      walletBalance: newBalance,
    });
    console.log("transatinH", transatinH);
    return res.status(200).json({successAmount,failureAmount,successCount,failureCount,});
  } else {
    console.log("fail");
    new AppError("operation failed", 401);
  }
});

const DMTneftAPI = catchAsync(async (req, res, next) => {
  const body = req.body;
  const user = req.user;
  const credentials = req.externalServiceData;
  const random15DigitNumber = generateRandomNumber15();
  raNo = `10174${random15DigitNumber}`;

  const response = await axios.post(
    "https://services.bankit.in:8443/DMR/transact/NEFT/v1/remit?",
    {
      agentCode: ra,
      recipientId: body.recipientId,
      customerId: body.phoneNumber,
      amount: body.amount,
      clientRefId: raNo,
    },
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: credentials,
      },
    }
  );
  // console.log("Response:", response.data);
  // }
  if (response) {
    return res.status(200).json(response.data);
  } else {
    console.log("fail");
  }
});

const DMTaccountVerification = catchAsync(async (req, res, next) => {
  const body = req.body;
  const user = req.user;
  const credentials = req.externalServiceData;
  const random15DigitNumber = generateRandomNumber15();
  raNo = `10174${random15DigitNumber}`;

  const response = await axios.post(
    "https://services.bankit.in:8443/DMRV1.1/transact/IMPS/accountverification?",
    {
      agentCode: ra,
      customerId: body.phoneNumber,
      amount: 1,
      clientRefId: raNo,
      udf1: body.bankAccountNumber,
      udf2: body.ifscCode,
    },
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: credentials,
      },
    }
  );
  // console.log("Response:", response.data);
  // }
  if (response) {
    return res.status(200).json(response.data);
  } else {
    console.log("fail");
  }
});

const DMTcheckWalletBalanceAPI = catchAsync(async (req, res, next) => {
  ///issue in this
  const credentials = req.externalServiceData;
  const response = await axios.get(
    "https://services.bankit.in:8443/DMR/generic/balance",
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: credentials,
      },
    }
  );
  console.log("Response::::::::::", response);
  // }
  if (response) {
    return res.status(200).json(response.data);
  } else {
    console.log("fail");
  }
});

const DMTtranscationStatusCheckAPI = catchAsync(async (req, res, next) => {
  const body = req.body;
  const credentials = req.externalServiceData;
  // const random12DigitNumber = generateRandomNumber();
  // raNo = `10174${random12DigitNumber}123`;
  const response = await axios.post(
    "https://services.bankit.in:8443/DMRV1.1/transact/searchtxn?",
    {
      clientRefId: body.clientRefId,
    },
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: credentials,
      },
    }
  );
  console.log("Response:", response);
  // }
  if (response) {
    return res.status(200).json(response.data);
  } else {
    console.log("fail");
  }
});

const DMTfetchBankList = catchAsync(async (req, res, next) => {
  const credentials = req.externalServiceData;

  const response = await axios.post(
    "https://services.bankit.in:8443/DMR/generic/bankList",{},
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: credentials,
      },
    }
  );
  console.log("Response:", response);
  // }
  if (response) {
    console.log("Response::::::::0", response.data);
    return res.status(200).json(response.data);
  } else {
    console.log("fail");
  }
});

const DMTcallBackUrl = catchAsync(async (req, res, next) => {
  ///issue in this
  const credentials = req.externalServiceData;
  const body = req.body;
  const response = await axios.post(
    `https://xyz.com?ClientRefID=${body.ClientRefID}&Status=${body.Status}&BankRefNo=${body.BankRefNo}`
  );
  console.log("res", response);
});

const DMTbankDownApi = catchAsync(async (req, res, next) => {
  const credentials = req.externalServiceData;
  const response = await axios.get(
    "https://services.bankit.in:8443/DMRV1.1/generic/bankDown",
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: credentials,
      },
    }
  );
  console.log("Response:", response);
  // }
  if (response) {
    return res.status(200).json(response.data);
  } else {
    console.log("fail");
  }
});

const fetchDTHRechargePlans = catchAsync(async (req, res, next) => {
  const { operator_id, circle_id, recharge_type } = req.query;

  // Construct the URL based on the presence of query parameters
  let apiUrl = `https://api.datayuge.com/v6/rechargeplans/?apikey=${process.env.DATAYUGE_API_KEY}`;

  if (operator_id) {
    apiUrl += `&operator_id=${operator_id}`;
  }
  if (circle_id) {
    apiUrl += `&circle_id=${circle_id}`;
  }
  if (recharge_type) {
    apiUrl += `&recharge_type=${recharge_type}`;
  } else {
    throw new AppError("Failed to fetch recharge plans", 400);
  }
});

function calculateTransactionShares(transactionAmounts) {
  const dmtShare = 3.54;
  let franchiseShare = 5.5;
  let serviceCharge;
  let remainingAmount; 
  // console.log("fffffff",typeof(transactionAmounts));
  transactionAmounts = Number(transactionAmounts);

  let count = Math.floor(transactionAmounts / 5000);
  remainingAmount =
    transactionAmounts % 5000 !== 0 && transactionAmounts > 5000
      ? transactionAmounts - 5000 * count
      : null;
  if (remainingAmount != null) {
    count = count + 1;
  } else if (count == 0) {
    count = count + 1;
  }

  let index = Math.floor((transactionAmounts - 1) / 1000);
  if (index >= 10) {
    index = 9;
  }
  serviceCharge = (index + 1) * 10;
  // console.log("fffffff",typeof(serviceCharge));
  serviceCharge = Number(serviceCharge);

  const netAmount = serviceCharge - dmtShare;
  const totalFranchiseShare = franchiseShare * (serviceCharge / 10);
  const totalAdminShare = netAmount - totalFranchiseShare;

  data = {
    transactionAmounts: transactionAmounts + serviceCharge,
    serviceCharge: serviceCharge,
    dmtShare: dmtShare,
    netAmount: netAmount,
    totalFranchiseShare: totalFranchiseShare,
    totalAdminShare: totalAdminShare,
    count: count,
    remainingAmount: remainingAmount,
  };

  return data;
}

function generateRandomNumber() {
  const randomNumber =
    Math.floor(Math.random() * (999999999999 - 100000000000 + 1)) +
    100000000000;
  return randomNumber.toString();
}

function generateRandomNumber15() {
  const min = 100000000000000; // 15 digits
  const max = 999999999999999; // 15 digits
  const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
  return randomNumber.toString();
}

module.exports = {
  DMTsendOtp,
  DMTuserCreate,
  DMTuserFetch,
  DMTfetchAllRecipientsOfUser,
  DMTaddBeneficery,
  DMTfetchSingleBeneficery,
  DMTdeleteBeneficery,
  DMTremitAPI,
  DMTneftAPI,
  DMTaccountVerification,
  DMTcheckWalletBalanceAPI,
  DMTtranscationStatusCheckAPI,
  DMTfetchBankList,
  DMTcallBackUrl,
  DMTbankDownApi,
};
