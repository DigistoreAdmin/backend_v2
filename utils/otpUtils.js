const axios = require("axios");

const TestNumbers = [1000000001, 1000000002, 1000000003, 1000000004];

const generateOTP = (mobileNumber) => {
  let isValidNumber = false;

  TestNumbers.forEach((testNumber) => {
    if (testNumber == mobileNumber) {
      isValidNumber = true;
    }
  });

  if (isValidNumber) {
    let otp = "123456";
    return otp;
  } else {
    return Math.floor(1000 + Math.random() * 9000); // Generate a 6-digit OTP
  }
};

const sendOTP = async (mobileNumber, otp) => {
  const apiKey = process.env.SMS_API_KEY;
  const sender = process.env.SMS_SENDER_ID;
  const careNumber = 8606172633;
  const message = `Your OTP for Digistore Pay application login is ${otp} . DO NOT SHARE . Contact ${careNumber} for further details. Team Digistore Pay`;
  const templateId = process.env.SMS_TEMPLATE_ID;
  const url = `http://thesmsbuddy.com/api/v1/sms/send`;

  try {
    // console.log("l");
    const response = await axios.get(url, {
      params: {
        key: apiKey,
        type: 1,
        to: mobileNumber,
        sender: sender,
        message: message,
        flash: 0,
        template_id: templateId,
      },
    });
    // console.log('response',response.statusText)
    if (response) {
      return response;
    } else {
      throw new Error(response);
    }
  } catch (error) {
    throw new Error(`Failed to send OTP: ${error.message}`);
  }
};

const sendOtpForgotPassword = async (mobileNumber, otp) => {
  const apiKey = process.env.SMS_API_KEY;
  const sender = process.env.SMS_SENDER_ID;
  const careNumber = 8606172633;
  const message = `Your OTP for password reset is ${otp} . DO NOT SHARE . Contact ${careNumber} for further details. Team Digistore Pay`;
  const templateId = process.env.SMS_TEMPLATE_ID;
  const url = `http://thesmsbuddy.com/api/v1/sms/send`;

  try {
    // console.log("l");
    const response = await axios.get(url, {
      params: {
        key: apiKey,
        type: 1,
        to: mobileNumber,
        sender: sender,
        message: message,
        flash: 0,
        template_id: templateId,
      },
    });
    // console.log('response',response.statusText)
    if (response) {
      return response;
    } else {
      throw new Error(response);
    }
  } catch (error) {
    throw new Error(`Failed to send OTP: ${error.message}`);
  }
};

module.exports = { generateOTP, sendOTP, sendOtpForgotPassword };

