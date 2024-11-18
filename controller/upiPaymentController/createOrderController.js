const axios = require("axios");
const catchAsync = require("../../utils/catchAsync");
const AppError = require("../../utils/appError");
const crypto = require("crypto");

function hashWithSHA512(data) {
  return crypto.createHash("sha512").update(data).digest("hex");
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

function validateExpiryTime(expiryTime) {
  return Number.isInteger(expiryTime) && expiryTime > 0 && expiryTime <= 8;
}

const CreateOrder = catchAsync(async (req, res, next) => {
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
  } = req.body;

  console.log("Request Body:", req.body);

  const timestamp = new Date().toISOString();
  const amountConverted = parseFloat(amount).toFixed(2);
  const clientId = process.env.CLIENT_ID;
  const clientSecret = process.env.CLIENT_SECRET;
  const string = `${orderId}${clientId}${timestamp}${clientSecret}`;
  const checksum = hashWithSHA512(string);
  
  const validateOrderId = isAlphanumericAndUnique(orderId);
  if (!validateOrderId) {
    return next(
      new AppError("Invalid Order ID. Please provide a valid alphanumeric Order ID.", 400)
    );
  }
  
  if (!validateExpiryTime(Number(expiryTime))) {
    return next(
      new AppError("Expiry time must be a positive integer and not exceed 10 minutes.", 400)
    );
  }

  try {
    const response = await axios.post(
      `https://acepay.dev.acepe.co.in/api/pg/v1/create-order?amount=${amountConverted}&orderId=${orderId}&timestamp=${timestamp}&currency=${currency}&customerEmail=${customerEmail}&customerPhone=${customerPhone}&terminalPhone=${terminalPhone}&customerBank=${customerBank}&customerAccountno=${customerAccountno}&customerIfsc=${customerIfsc}&terminalId=${terminalId}&expiryTime=${expiryTime}&terminalType=${terminalType}&checksum=${checksum}`
    );

    res.status(200).json({
      status: true,
      message: "Order Created Successfully",
      data: response.data,
    });
  } catch (error) {
    console.error("Error creating order:", error.message);
    res.status(500).json({ status: false, message: error.message });
  }
});

module.exports = { CreateOrder };
