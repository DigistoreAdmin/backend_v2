const catchAsync = require("../../utils/catchAsync");
const AppError = require("../../utils/appError");
const Franchise = require("../../db/models/franchise")
const wallets = require("../../db/models/wallet")
const transationHistories = require("../../db/models/transationhistory");

const crypto = require("crypto");
const { default: axios } = require("axios");

const checkIntentStatus = catchAsync(async (req, res, next) => {
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

  if (!walletData) {
    return res.status(404).json({ error: "Franchise not found" });
  }

  const clientId = process.env.CLIENT_ID;
  const clientSecret = process.env.CLIENT_SECRET;

  const timestamp = new Date().toISOString();
  const string = `${orderId}${clientId}${timestamp}${clientSecret}`;
  console.log('string: ', string);
  const checksum = hashWithSHA512(string);

  try {
    const checkIntentStatusResponse = await axios.post(
      `https://acepay.dev.acepe.co.in/api/pg/v1/check-intent-status?orderId=${orderId}&timestamp=${timestamp}&checksum=${checksum}`
    );

    console.log("checkIntentStatusResponse: ", checkIntentStatusResponse.data)

    if (checkIntentStatusResponse.data.txnStatus === "SUCCESS") {
      let newBalance = walletData.balance + checkIntentStatusResponse.data.amount;
      console.log("newBalance: ", newBalance);

      const updatedBalance = await wallets.update(
        { balance: newBalance },
        { where: { uniqueId: Data.franchiseUniqueId } }
      );

      const transactionH = await transationHistories.create({
        transactionId: checkIntentStatusResponse.data.orderId,
        uniqueId: Data.franchiseUniqueId,
        userName: Data.franchiseName,
        userType: user.userType,
        service: "UPI wallet Topup",
        status: "success",
        amount: checkIntentStatusResponse.data.amount,
        walletBalance: newBalance,
      });
      if (updatedBalance && transactionH) {
        return res
          .status(200)
          .json({
            data: checkIntentStatusResponse.data,
            message: "Topup success",
          });
      }
    } else {
      const transactionH = await transationHistories.create({
        transactionId: checkIntentStatusResponse.data.orderId,
        uniqueId: Data.franchiseUniqueId,
        userName: Data.franchiseName,
        userType: user.userType,
        service: "UPI wallet Topup",
        status: "fail",
        amount: checkIntentStatusResponse.data.amount,
        walletBalance: walletData.balance,
      });
      if (transactionH) {
        return res
          .status(400)
          .json({ error: checkIntentStatusResponse.data, message: "Operation failed" });
      }
    }
    
    // return res.status(200).json({
    //     message: "success",
    //     data: checkIntentStatusResponse.data,
    //   });

  } catch (error) {
    console.error(
      "Error in checkIntentStatus:",
      error.response ? error.response.data : error.message
    );
    return next(new AppError("Error in checkIntentStatus", 500));
  }
});

 module.exports = { checkIntentStatus };
 
function hashWithSHA512(data) {console.log();
  return crypto.createHash("sha512").update(data).digest("hex");
}
