const axios = require("axios");
const catchAsync = require("../../utils/catchAsync");
const AppError = require("../../utils/appError");
const crypto = require("crypto");

const payOrder = catchAsync(async (req, res, next) => {
  const { amount, orderId, payerVpa, payerName, remarks } = req.body;

  const timestamp = new Date().toISOString();
  const clientId = process.env.CLIENT_ID;
  const clientSecret = process.env.CLIENT_SECRET;

  const string = `${orderId}${clientId}${timestamp}${clientSecret}`;
  const checksum = hashWithSHA512(string);

  const remarkValidate = validateInput(remarks);
  if (!remarkValidate) {
    return next(new AppError("Please provide a valid remarks", 401));
  }

  try {
    const payOrderResponse = await axios.post(
      `https://acepay.dev.acepe.co.in/api/pg/v1/pay-order?&amount=${amount}&orderId=${orderId}&timestamp=${timestamp}&payerVpa=${payerVpa}&payerName=${payerName}&remarks=${remarks}&checksum=${checksum}`
    );

    return res.status(200).json({
      message: "success",
      data: payOrderResponse.data,
    });
  } catch (error) {
    console.error(
      "Error in pay order:",
      error.response ? error.response.data : error.message
    );
    return next(new AppError("Error in pay order", 500));
  }
});

function validateInput(input) {
  const regex = /^[a-zA-Z0-9.-]{1,50}$/;
  return regex.test(input);
}

function hashWithSHA512(data) {
  return crypto.createHash("sha512").update(data).digest("hex");
}

module.exports = { payOrder };
