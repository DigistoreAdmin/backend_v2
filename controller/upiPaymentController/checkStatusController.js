const { default: axios } = require("axios");
const catchAsync = require("../../utils/catchAsync");
const AppError = require("../../utils/appError");
const crypto = require("crypto");

const checkStatus = catchAsync(async (req, res, next) => {
  const { orderId } = req.body;

  if (!orderId) {
    return res.status(400).json({ error: "orderId is required" });
  }

  const clientId = process.env.CLIENT_ID;
  const clientSecret = process.env.CLIENT_SECRET;

  const timestamp = new Date().toISOString();
  const string = `${orderId}${clientId}${timestamp}${clientSecret}`;
  console.log('string: ', string);
  const checksum = hashWithSHA512(string);


  try {
    const checkStatusResponse = await axios.post(
      `https://acepay.dev.acepe.co.in/api/pg/v1/check-order-status?orderId=${orderId}&timestamp=${timestamp}&checksum=${checksum}`
    );

    return res.status(200).json({
        message: "success",
        data: checkStatusResponse.data,
      });
  } catch (error) {
    console.error(
      "Error in upiIntent:",
      error.response ? error.response.data : error.message
    );
    return next(new AppError("Error in upiIntent", 500));
  }
});

 module.exports = { checkStatus };


function hashWithSHA512(data) {
  return crypto.createHash("sha512").update(data).digest("hex");
}
