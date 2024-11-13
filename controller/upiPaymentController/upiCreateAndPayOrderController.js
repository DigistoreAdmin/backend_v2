const axios = require("axios");
const catchAsync = require("../../utils/catchAsync");
const AppError = require("../../utils/appError");
const crypto = require("crypto");

const hashWithSHA512 = (data) =>
  crypto.createHash("sha512").update(data).digest("hex");

function validateExpiryTime(expiryTime) {
  return Number.isInteger(expiryTime) && expiryTime > 0 && expiryTime <= 10;
}

function validateInput(input) {
  const regex = /^[a-zA-Z0-9.-]{1,50}$/;
  return regex.test(input);
}

function isAlphanumericAndUnique(input) {
  const regex = /^[a-zA-Z0-9]+$/;
  if (!regex.test(input)) {
    return false;
  }
  const charSet = new Set();
  for (const char of input) {
    if (charSet.has(char)) {
      return false;
    }
    charSet.add(char);
  }
  return true;
}

const createAndPayOrder = catchAsync(async (req, res, next) => {
  const {
    amount,
    orderId,
    currency,
    customerEmail,
    customerPhone,
    customerBank,
    customerAccountno,
    customerIfsc,
    terminalId,
    terminalPhone,
    terminalType,
    expiryTime,
    payerVpa,
    payerName,
    remarks,
  } = req.body;
  console.log("req.body: ", req.body);

  const timestamp = new Date().toISOString();
  const amountConverted = parseFloat(amount).toFixed(2);
  const clientId = process.env.CLIENT_ID;
  const clientSecret = process.env.CLIENT_SECRET;
  const checksumString = `${orderId}${clientId}${timestamp}${clientSecret}`;
  const checksum = hashWithSHA512(checksumString);

  // Validate inputs
  if (!isAlphanumericAndUnique(orderId)) {
    return next(
      new AppError("Invalid Order ID. Must be unique and alphanumeric.", 400)
    );
  }
  if (!validateExpiryTime(Number(expiryTime))) {
    return next(
      new AppError(
        "Expiry time must be a positive integer and not exceed 8 minutes.",
        400
      )
    );
  }
  if (!validateInput(remarks)) {
    return next(new AppError("Invalid remarks format.", 400));
  }

  try {
    // Step 1: Call create-order API
    const createOrderResponse = await axios.post(
      `https://acepay.dev.acepe.co.in/api/pg/v1/create-order?amount=${amountConverted}&orderId=${orderId}&timestamp=${timestamp}&currency=${currency}&customerEmail=${customerEmail}&customerPhone=${customerPhone}&terminalPhone=${terminalPhone}&customerBank=${customerBank}&customerAccountno=${customerAccountno}&customerIfsc=${customerIfsc}&terminalId=${terminalId}&expiryTime=${expiryTime}&terminalType=${terminalType}&checksum=${checksum}`
    );

    // Check if create-order was successful
    if (createOrderResponse.data.status === "false") {
      return next(new AppError("Order ID already exist", 500));
    }

    // Step 2: Call pay-order API
    const payOrderResponse = await axios.post(
      `https://acepay.dev.acepe.co.in/api/pg/v1/pay-order?&amount=${amountConverted}&orderId=${orderId}&timestamp=${timestamp}&payerVpa=${payerVpa}&payerName=${payerName}&remarks=${remarks}&checksum=${checksum}`
    );

    if (payOrderResponse.data.status === "success") {
      const serviceCharge = amountConverted * 0.01;
      payOrderResponse.data.serviceCharge = serviceCharge;
    }
    return res.status(200).json({
      message: "Order created and paid successfully",
      createOrderData: createOrderResponse.data,
      payOrderData: payOrderResponse.data,
    });
  } catch (error) {
    console.error(
      "Error in order sequence:",
      error.response ? error.response.data : error.message
    );
    return next(new AppError("Error processing order sequence", 500));
  }
});

module.exports = { createAndPayOrder };
