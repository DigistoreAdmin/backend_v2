const axios = require('axios');
const catchAsync = require("../../utils/catchAsync");
const payoutImpsTransactionHistory = require('../../db/models/payoutimpstransactionhistory')


const impsFundTransfer = catchAsync(async (req, res, next) => {

    const requiredFields = [
        'source', 'transactionID', 'debitAccountNumber',
        'creditAccountNumber', 'remitterName', 'amount',
        'currency', 'transactionType', 'paymentDescription',
        'beneficiaryIFSC', 'mobileNo'
    ];

    for (const field of requiredFields) {
        if (!req.body[field]) {
            return res.status(400).json({
                error: `Missing required field: ${field}`
            });
        }
    }
    const { mobileNo } = req.body;

    // Regular expression to check if mobileNo has exactly 10 digits
    const phoneRegex = /^\d{10}$/;

    if (!phoneRegex.test(mobileNo)) {
        return res.status(400).json({
            success: false,
            message: "mobileNo must be exactly 10 digits",
        });
    }
  
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
      

        const metaData = response.data.initiateAuthGenericFundTransferAPIResp.metaData;
        const resourceData = response.data.initiateAuthGenericFundTransferAPIResp.resourceData;
      
        await payoutImpsTransactionHistory.create({
          status: resourceData.status === "ACPT" ? "SUCCESS" : metaData.status,
          code: metaData.code || null,
          message: metaData.message || null,
          version: metaData.version || null,
          time: metaData.time || null,
          transactionReferenceNo: resourceData.transactionReferenceNo || null,
          transactionID: resourceData.transactionID || null,
          beneficiaryName: resourceData.beneficiaryName || null,
          reason: null,
          service: null,
          details: null,
          balance: null, //need to add
          bankCharge: null, //need to add
          HOCommission: null, //need to add
          createdAt: new Date(),
          updatedAt: new Date(),
        });
        res.status(200).json({
            data: response.data
        });

  } catch (error) {
        const errorData = error.response ? error.response.data : error.message;
        res.status(500).json({
            error: errorData
        });
  }
});


module.exports = {
  impsFundTransfer
}