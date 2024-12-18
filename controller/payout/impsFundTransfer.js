const axios = require('axios');
const catchAsync = require("../../utils/catchAsync");



const impsFundTransfer = catchAsync(async (req, res, next) => {
  
  const requestData = {
      initiateAuthGenericFundTransferAPIReq: {
          source: req.body.source,
          correlationId: req.body.transactionID,
          transactionID: req.body.transactionID ,
          debitAccountNumber: req.body.debitAccountNumber,
          creditAccountNumber: req.body.creditAccountNumber ,
          remitterName: req.body.remitterName ,
          amount: req.body.amount ,
          currency: req.body.currency ,
          transactionType: req.body.transactionType ,
          paymentDescription: req.body.paymentDescription ,
          beneficiaryIFSC: req.body.beneficiaryIFSC ,
          mobileNo: req.body.mobileNo 
      }
  };

  // Step 2: Send the request to the external API
  const apiUrl = 'https://apiext.uat.idfcfirstbank.com/paymenttxns/v1/fundTransfer';

  try {
      const response = await axios.post(apiUrl, requestData, {
          headers: {
              'Content-Type': 'application/json',
              // Add Authorization header if needed
              // 'Authorization': 'Bearer YOUR_ACCESS_TOKEN'
          }
      });

      // Step 3: Send response back to the client
      res.status(200).json({
          data: response.data
      });

  } catch (error) {
      // Handle errors from the external API
      res.status(500).json({
        data: response.data
      });
  }
});



module.exports = {
  impsFundTransfer
}