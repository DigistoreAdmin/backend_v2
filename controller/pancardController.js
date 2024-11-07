const Franchise = require('../db/models/franchise');
const panCardUsers = require('../db/models/pancard');
const azureStorage = require('azure-storage');
const intoStream = require('into-stream');
const transationHistory = require('../db/models/transationhistory')
const wallets = require('../db/models/wallet');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

const containerName = 'imagecontainer';
const blobService = azureStorage.createBlobService(process.env.AZURE_STORAGE_CONNECTION_STRING);

const uploadBlob = async (file) => {
  return new Promise((resolve, reject) => {
    const blobName = file.name;
    const stream = intoStream(file.data);
    const streamLength = file.data.length;

    blobService.createBlockBlobFromStream(containerName, blobName, stream, streamLength, (err) => {
      if (err) {
        return reject(err);
      }
      const blobUrl = blobService.getUrl(containerName, blobName);
      resolve(blobUrl);
    });
  });
};

const createPancard = async (req, res,next) => {
  try {
    const {
      totalAmount = 0,
      accountNo,
      panType,
      assignedId,
      isCollege,
      isDuplicateOrChangePan,
      customerName,
      email,
      phoneNumber,
      aadhaarNumber,
      fatherName,
      collegeID,
      coordinatorID,
      coordinatorName,
      reasonForDuplicate,
      panNumber,
      representativeName,
      representativeRelation,
      abroadAddress,
      nameChange,
      addressChange,
      dobChange,
      changeFatherName,
    } = req.body;
    console.log('req.body: ', req.body);

    const {
      proofOfDOB,
      proofOfAddress,
      proofOfIdentity,
      representativeDocument,
      photo,
      signature,
      aadhaarFront,
      aadhaarBack,
      representativeAadhaarBack,
      representativeAadhaarFront,
      representativeSignature,
    } = req.files;

    let minAmount = 150;
    let maxAmount = 250;
   let commissionToHO = 55;
   let commissionToFranchise = totalAmount - minAmount;
   let amount = totalAmount - commissionToFranchise;
   

    const uploadFile = async (file) => {
      if (file) {
        try {
          return await uploadBlob(file);
        } catch (error) {
          console.error(`Error uploading file ${file.name}:`, error);
          return null;
        }
      } else {
        console.error('File is missing:', file);
        return null;
      }
    };

    const proofOfIdentityUrl = await uploadFile(proofOfIdentity);
    const proofOfDOBUrl = await uploadFile(proofOfDOB);
    const proofOfAddressUrl = await uploadFile(proofOfAddress);
    const representativeDocumentUrl = await uploadFile(representativeDocument);
    const photoUrl = await uploadFile(photo);
    const signatureUrl = await uploadFile(signature);
    const aadhaarFrontUrl = await uploadFile(aadhaarFront);
    const aadhaarBackUrl = await uploadFile(aadhaarBack)
    const representativeAadhaarBackUrl = await uploadFile(representativeAadhaarBack)
    const representativeAadhaarFrontUrl = await uploadFile(representativeAadhaarFront)
    const representativeSignatureUrl = await uploadFile(representativeSignature)
    
    const inputData = {
      nameChange:nameChange,
      addressChange:addressChange,
      dobChange:dobChange,
      changeFatherName:changeFatherName,
    };

    const processInputData = (data) => {
      const fields = ['nameChange', 'addressChange', 'dobChange', 'changeFatherName', 'signatureChangeUrl', 'photoChangeUrl'];

      fields.forEach((field) => {
        if (!data[field]) {
          data[field] = 'NOT SELECTED';
        }
      });

      return data;
    };

    const processedData = processInputData(inputData);

    const user = req.user;

    const franchise = await Franchise.findOne({ where: { email: user.email } });

    if (!franchise) {
      return res.status(404).json({
        status: 'fail',
        message: 'Franchise not found',
      });
    }

    const uniqueId = franchise.franchiseUniqueId;
 
    const PancardUser = panCardUsers(panType, isCollege, isDuplicateOrChangePan);


    if (franchise.verified == "false") {
      return next(new AppError("franchise not verified", 401));
    }

    
    if(totalAmount < minAmount){
      return next(new AppError("Insufficient amount" , 401));
    }

    if(totalAmount > maxAmount){
      return next(new AppError("Amount Exeeded" , 401));
    }


   const walletData = await wallets.findOne({
      where: { uniqueId: franchise.franchiseUniqueId },
    });

    
    if (!walletData) return next(new AppError("Wallet not found", 404));


    if(amount > walletData.balance){
      return next(new AppError("Insufficient wallet balance", 401));
      }

      const newBalance =Math.round(walletData.balance-amount)
      console.log('walletData.balance: ', walletData.balance);
      console.log('newBalance: ', newBalance);
      
  
      const updated = await wallets.update(
        { balance: newBalance },
        { where: { uniqueId: franchise.franchiseUniqueId } }
      );


  
    const transactionId=generateRandomId()

    const newPancardUser = await PancardUser.create({
      panType,
      uniqueId,
      assignedId,
      customerName,
      email,
      phoneNumber,
      fatherName,
      aadhaarNumber,
      isCollege,
      collegeID,
      coordinatorID,
      coordinatorName,
      isDuplicateOrChangePan,
      reasonForDuplicate,
      panNumber,
      abroadAddress,
      totalAmount,
      commissionToFranchise,
      commissionToHO,
      nameChange: processedData.nameChange,
      addressChange: processedData.addressChange,
      dobChange: processedData.dobChange,
      changeFatherName: processedData.changeFatherName,
      representativeName,
      representativeRelation,
      representativeDocument: representativeDocumentUrl,
      proofOfIdentity: proofOfIdentityUrl,
      proofOfDOB: proofOfDOBUrl,
      proofOfAddress: proofOfAddressUrl,
      photo: photoUrl,
      signature: signatureUrl,
      aadhaarFront: aadhaarFrontUrl,
      aadhaarBack: aadhaarBackUrl,
      representativeAadhaarFront: representativeAadhaarFrontUrl,
      representativeAadhaarBack: representativeAadhaarBackUrl,
      representativeSignature: representativeSignatureUrl,
      createdAt: new Date(),
      updatedAt: new Date(),
    });


    const newTransactionHistory = await transationHistory.create({
      transactionId: transactionId,
      uniqueId: franchise.franchiseUniqueId,
      userName: franchise.franchiseName,
      userType: user.userType,
      service: "pancardRegistration",
      customerNumber: phoneNumber,
      serviceNumber: accountNo,
      serviceProvider: "pancard",
      status: "success",
      amount: amount,
      franchiseCommission: commissionToFranchise,
      adminCommission: commissionToHO,
      walletBalance: newBalance,
    });

    if (!newPancardUser && !newTransactionHistory && !updated) {
      return res.status(400).json({
        status: 'fail',
        message: 'pancard registration failed',
      });
    }

    res.status(201).json({
      status: 'success',
      data: newPancardUser,
    });

  } catch (error) {
    console.error('Error creating pancard:', error);
    res.status(500).json({ error: 'Failed to create pancard' });
  }
};

const updatePanDetails = catchAsync(async (req, res, next) => {
  const { workId, status, acknowledgementNumber, reason, ePan} = req.body;
  console.log(' req.body: ',  req.body);

  let amount=150;
  const acknowledgementFile = req?.files?.acknowledgementFile;
  const user = req.user;

  if (!workId) {
    return next(new AppError("workId is required", 400));
  }

  const pancardUser = panCardUsers();

  const data = await pancardUser.findOne({
    where: { workId },
  });

  const phoneNumber=data.phoneNumber

  if (!data) {
    return res.status(404).json({ message: "Record not found" });
  }

  const franchiseData = await Franchise.findOne({
    where: { email: user.email },
  });

  if (!franchiseData) {
    return next(new AppError("Franchise not found", 404));
  }

  const walletData = await wallets.findOne({
    where: { uniqueId: franchiseData.franchiseUniqueId },
  });

  if (!walletData) {
    return next(new AppError("Wallet not found", 404));
  }

  const uploadFile = async (file) => {
    if (file) {
      try {
        return await uploadBlob(file);
      } catch (error) {
        console.error(`Error uploading file ${file.name}:`, error);
        throw new AppError("File upload failed", 500);
      }
    }
    return null;
  };

  const acknowledgementFileUrl = await uploadFile(acknowledgementFile);

  try {
    if (status === "rejected") {
      const newBalance = Math.round(Number(walletData.balance) + Number(amount));

      await wallets.update(
        { balance: newBalance },
        { where: { uniqueId: franchiseData.franchiseUniqueId } }
      );

      const transactionId = generateRandomId();

      await transationHistory.create({
        transactionId,
        uniqueId: franchiseData.franchiseUniqueId,
        userName: franchiseData.franchiseName,
        userType: user.userType,
        service: "pancard-rejected",
        customerNumber: phoneNumber,
        serviceProvider: "pancard",
        status: "fail",
        amount,
        franchiseCommission: 0.00,
        adminCommission: 0.00,
        walletBalance: newBalance,
      });

      await pancardUser.update(
        { status: "rejected" },
        { where: {workId } }
      );

      return res.status(200).json({ message: "PAN card rejected successfully" });
    }

    if (status === "completed") {
      await pancardUser.update({
        status: "completed",
        acknowledgementFile: acknowledgementFileUrl,
        acknowledgementNumber,
        reason,
        ePan,
      }, { where: { workId } });

      return res.status(200).json({ message: "PAN card updated successfully" });
    }
    return next(new AppError("Invalid status provided", 400));
  } catch (error) {
    return next(new AppError("An error occurred while updating PAN card details", 500));
  }
});


function generateRandomId() {
  const prefix = "DSP";
  const timestamp = Date.now().toString(); 
  return prefix + timestamp;
}

module.exports = { createPancard, updatePanDetails };
