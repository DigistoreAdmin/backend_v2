// // const fast2sms = require("fast-two-sms");
// const axios = require('axios');

// require("dotenv").config();

// const TestNumbers = [9234234543, 7865439087, 6474863123, 7845612390];

// exports.sendMessage = async (mobile, res, next)=> {

//   let isValidNumber = false;

//   TestNumbers.forEach((testNumber) => {
//     if (testNumber === mobile) { 
//       isValidNumber = true;
//     }
//   });

//   if (isValidNumber) {
//     let otp = "123456"
//     return otp
//   } else {
    
//     let randomOTP = Math.floor(1000 + Math.random() * 9000);
//     const apiKey = process.env.SMS_API_KEY;
//     const sender = process.env.SMS_SENDER_ID;
//     const careNumber= 8606172633
//     const message = `Your OTP for Digistore Pay application login is ${randomOTP} . DO NOT SHARE . Contact ${careNumber} for further details. Team Digistore Pay`;
//     const templateId = process.env.SMS_TEMPLATE_ID;
//     const url = `http://thesmsbuddy.com/api/v1/sms/send`;
    
//     try {
//       // console.log("l");
//       const response = await axios.get(url, {
//         params: {
//           key: apiKey,
//           type: 1, 
//           to: mobile,
//           sender: sender,
//           message: message,
//           flash: 0,
//           template_id: templateId
//         }
//       });
//       // return randomOTP;
//       // console.log('response',response.statusText)
//       return randomOTP; 
//       if (response) {
//       } else {
//         throw new Error(response);
//       }
//     } catch (error) {
//       throw new Error(`Failed to send OTP: ${error.message}`);
//     }
//   }
// };


