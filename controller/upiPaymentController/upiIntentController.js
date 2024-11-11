const axios = require("axios");
const catchAsync = require("../../utils/catchAsync");
const AppError = require("../../utils/appError");
const crypto = require("crypto");

const upiIntent = catchAsync(async (req, res, next) => {
  const { amount, orderId, name, remarks } = req.body;

  const timestamp = new Date().toISOString();
  const amountConverted = parseFloat(amount).toFixed(2);
  const clientId = process.env.CLIENT_ID;
  const clientSecret = process.env.CLIENT_SECRET;

  const string = `${orderId}${clientId}${timestamp}${clientSecret}`;
  const checksum = hashWithSHA512(string);
  console.log('checksum: ', checksum);

  const remarkValidate = validateInput(remarks);
  if (!remarkValidate) {
    return next(new AppError("Please provide a valid remarks", 401));
  }

  try {
    const upiIntentResponse = await axios.post(
        `https://acepay.dev.acepe.co.in/api/pg/v1/pay-intent?&orderId=${orderId}&amount=${amountConverted}&timestamp=${timestamp}&name=${name}&remarks=${remarks}&checksum=${checksum}`
    );
    
    console.log('upiIntentResponse: ', upiIntentResponse);
    return res.status(200).json({
      message: "success",
      data: upiIntentResponse.data,
    });
  } catch (error) {
    console.error(
      "Error in upiIntent:",
      error.response ? error.response.data : error.message
    );
    return next(new AppError("Error in upiIntent", 500));
  }
});

function validateInput(input) {
  const regex = /^[a-zA-Z0-9.-]{1,50}$/;
  return regex.test(input);
}

function hashWithSHA512(data) {console.log();
  return crypto.createHash("sha512").update(data).digest("hex");
}

module.exports = { upiIntent };
