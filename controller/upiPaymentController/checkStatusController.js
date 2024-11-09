const axios  = require("axios");
const catchAsync = require("../../utils/catchAsync");
const AppError = require("../../utils/appError");
const crypto = require("crypto");
const transationHistories = require("../../db/models/transationhistory");
const Franchise = require("../../db/models/franchise");
const wallets = require("../../db/models/wallet");

const checkStatus = catchAsync(async (req, res, next) => {
  const { orderId } = req.body;

  if (!orderId) {
    return res.status(400).json({ error: "orderId is required" });
  }

  const user = req.user;
  const Data = await Franchise.findOne({ where: { email: user.email } });

  if (!Data) {
    return res.status(404).json({ error: "Franchise not found" });
  }

  const walletData =await wallets.findOne({
    where: { uniqueId: Data.franchiseUniqueId },
  });

  if (!Data) {
    return res.status(404).json({ error: "Franchise not found" });
  }

  const clientId = process.env.CLIENT_ID;
  const clientSecret = process.env.CLIENT_SECRET;

  const timestamp = new Date().toISOString();
  const string = `${orderId}${clientId}${timestamp}${clientSecret}`;
  console.log("string: ", string);
  const checksum = hashWithSHA512(string);

  try {
    const checkStatusResponse = await axios.post(
      `https://acepay.dev.acepe.co.in/api/pg/v1/check-order-status?orderId=${orderId}&timestamp=${timestamp}&checksum=${checksum}`
    );

    if (checkStatusResponse.data.txnStatus === "SUCCESS") {
      let newBalance = walletData.balance + checkStatusResponse.data.amount;
      console.log("newBalance: ", newBalance);

      const updatedBalance = await wallets.update(
        { balance: newBalance },
        { where: { uniqueId: Data.franchiseUniqueId } }
      );

      const transactionH = await transationHistories.create({
        transactionId: checkStatusResponse.data.orderId,
        uniqueId: Data.franchiseUniqueId,
        userName: Data.franchiseName,
        userType: user.userType,
        service: "UPI wallet Topup",
        status: "success",
        amount: checkStatusResponse.data.amount,
        walletBalance: newBalance,
      });
      if (updatedBalance && transactionH) {
        return res
          .status(200)
          .json({
            data: checkStatusResponse.data,
            message: "Topup success",
          });
      }
    } else {
      const transactionH = await transationHistories.create({
        transactionId: checkStatusResponse.data.orderId,
        uniqueId: Data.franchiseUniqueId,
        userName: Data.franchiseName,
        userType: user.userType,
        service: "UPI wallet Topup",
        status: "fail",
        amount: checkStatusResponse.data.amount,
        walletBalance: walletData.balance,
      });
      if (transactionH) {
        return res
          .status(400)
          .json({ error: checkStatusResponse.data, message: "Operation failed" });
      }
    }

    // return res.status(200).json({
    //     message: "success",
    //     data: checkStatusResponse.data,
    //   });
  } catch (error) {
    console.error(
      "Error in check Status:",
      error.response?.data || error.message
    );
    return next(new AppError("Error in Check Status", 500));
  }
});

module.exports = { checkStatus };

function hashWithSHA512(data) {
  return crypto.createHash("sha512").update(data).digest("hex");
}
