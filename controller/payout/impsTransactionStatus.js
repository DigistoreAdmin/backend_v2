const axios = require('axios');
const catchAsync = require("../../utils/catchAsync");
const payoutImpsTransactionHistory = require('../../db/models/payoutimpstransactionhistory')


const impsTransactionStatus = catchAsync(async (req, res, next) => {


  const requiredFields = [
    'source', 'transactionID',
    'transactionType', 'transactionDate',
];

for (const field of requiredFields) {
    if (!req.body[field]) {
        return res.status(400).json({
            error: `Missing required field: ${field}`
        });
    }
}

const requestData = {
  initiateAuthGenericFundTransferAPIReq: {
      source: req.body.source,
      correlationId: req.body.transactionID,
      transactionType: req.body.transactionType ,
      transactionDate: req.body.transactionDate 
  }
};

const apiUrl = 'https://apiext.uat.idfcfirstbank.com/paymentenqs/v1/paymentTransactionStatus';

  try {
      const response = await axios.post(apiUrl, requestData, {
          headers: {
              'Content-Type': 'application/json',
              // Add Authorization header if needed
              // 'Authorization': 'Bearer YOUR_ACCESS_TOKEN'
          }
      });


      const data = response.data;
      const metaData = data.paymentTransactionStatusResp?.metaData || {};
      const resourceData = data.paymentTransactionStatusResp?.resourceData || {};
      const errorData = data || {};

      // Create the record in the database
      await payoutImpsTransactionHistory.create({
          // MetaData fields
          status: metaData.status || null,
          code: metaData.code || null,
          message: metaData.message || null,
          version: metaData.version || null,
          time: metaData.time || null,
          // ResourceData fields
          respCode: resourceData.respCode || null,
          beneficiaryAccountNumber: resourceData.beneficiaryAccountNumber || null,
          beneficiaryName: resourceData.beneficiaryName || null,
          errorId: resourceData.errorId || null,
          errorMessage: resourceData.errorMessage || null,
          transactionType: resourceData.transactionType || null,
          paymentReferenceNumber: resourceData.paymentReferenceNumber || null,
          transactionReferenceNumber: resourceData.transactionReferenceNumber || null,
          transactionDate: resourceData.transactionDate || null,
          amount1: resourceData.amount1 || null,
          status1: resourceData.status1 || null,
          transactionTime: resourceData.transactionTime || null,
          n10Time: resourceData.n10Time || null,
          suspenseReason: resourceData.suspenseReason || null,
          inOutTime: resourceData.inOutTime || null,
          camt59Time: resourceData.camt59Time || null,
          // Error response fields
          reason: errorData.reason || null,
          service: errorData.service || null,
          details: errorData.details || null,
      });

      res.status(200).json({
          responseData: data,
      });

    } catch (error) {
      const errorData = error.response ? error.response.data : error.message;
      res.status(500).json({
          error: errorData
      });
   }

})





module.exports = {
  impsTransactionStatus
}