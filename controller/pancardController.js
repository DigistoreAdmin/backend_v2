const Franchise = require('../db/models/franchise');
const panCardUsers = require('../db/models/pancard');
const azureStorage = require('azure-storage');
const intoStream = require('into-stream');
const transationHistory = require('../db/models/transationhistory')
const wallets = require('../db/models/wallet');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const { Op} = require('sequelize');
const transationHistories = require('../db/models/transationhistory');

const containerName = 'imagecontainer';
const blobService = azureStorage.createBlobService(process.env.AZURE_STORAGE_CONNECTION_STRING);

const getCurrentDate = () => {
  const date = new Date();
  return `${date.getDate().toString().padStart(2, "0")}${(date.getMonth() + 1)
    .toString()
    .padStart(2, "0")}${date.getFullYear()}`;
};


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
    const user = req.user;

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
   let amount = 150;

   
   const franchise = await Franchise.findOne({ where: { email: user.email } });
   
   if (!franchise) {
     return res.status(404).json({
       status: 'fail',
       message: 'Franchise not found',
      });
    }
    
  const uniqueId = franchise.franchiseUniqueId;

  if (!franchise.verified) {
    return next(new AppError("franchise not verified", 401));
  }

  const walletData = await wallets.findOne({
    where: { uniqueId},
  });

  if (!walletData) return next(new AppError("Wallet not found", 404));

  if(amount > walletData.balance){
    return next(new AppError("Insufficient wallet balance", 401));
    }

    if(totalAmount < minAmount){
      return next(new AppError("Insufficient amount" , 401));
    }

    if(totalAmount > maxAmount){
      return next(new AppError("Amount Exeeded" , 401));
    }

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

    const PancardUser = panCardUsers(panType, isCollege, isDuplicateOrChangePan);

   const newBalance =Math.round(walletData.balance-amount)
      
      const updated = await wallets.update(
        { balance: newBalance },
        { where: { uniqueId: franchise.franchiseUniqueId } }
      );

      const currentDate = getCurrentDate();
      const code = "PAN";
      const lastPan = await PancardUser.findOne({
        where: {
          workId: {
            [Op.like]: `${currentDate}${code}%`,
          },
        },
        order: [["createdAt", "DESC"]],
      });
      let increment = "001";
      if (lastPan) {
        const lastIncrement = parseInt(lastPan.workId.slice(-3));
        increment = (lastIncrement + 1).toString().padStart(3, "0");
      }
      
    const workId = `${currentDate}${code}${increment}`;
      

    const newPancardUser = await PancardUser.create({
      workId,
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
      totalAmount:amount,
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
      transactionId: workId,
      uniqueId: franchise.franchiseUniqueId,
      userName: franchise.franchiseName,
      userType: user.userType,
      service: "Pan Card",
      customerNumber: phoneNumber,
      serviceNumber: accountNo,
      serviceProvider: "pancard",
      commissionType:"cash",
      status: "pending",
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

const staffPanCardReject = catchAsync(async (req, res, next) => {
  const { workId, reason } = req.body;
  const amount = 150;

  if (!workId) {
    return next(new AppError("workId is required", 400));
  }

  const pancardUser = panCardUsers();
  const data = await pancardUser.findOne({ where: { workId } });

  if (!data) {
    return res.status(404).json({ message: "Record not found" });
  }

  const transaction = await transationHistory.findOne({ where: { transactionId: workId } });

  if (!transaction) {
    return res.status(404).json({ message: "Transaction not found" });
  }

  const franchiseUniqueId=data.uniqueId

  if (!franchiseUniqueId) {
    return res.status(404).json({ message: "uniqueId not found" });
  }

  const walletData = await wallets.findOne({ where: { uniqueId: franchiseUniqueId } });
  if (!walletData) {
    return next(new AppError("Wallet not found", 404));
  }

  const newBalance = Math.round(Number(walletData.balance) + amount);

  try {
    await wallets.update(
      { balance: newBalance },
      { where: { uniqueId: franchiseUniqueId } }
    );

    await transationHistory.update(
      {
        service: "Pan Card",
        status: "fail",
        walletBalance: newBalance,
        franchiseCommission: 0.0,
        adminCommission: 0.0,
      },
      { where: { transactionId: workId } }
    );

    await pancardUser.update(
      { status: "rejected", reason },
      { where: { workId } }
    );

    return res.status(200).json({ message: "PAN card rejected successfully" });
  } catch (error) {
    return next(new AppError("An error occurred while PAN card rejection", 500));
  }
});


const staffPanCardComplete = catchAsync(async (req, res, next) => {
  const { workId, acknowledgementNumber } = req.body;
  const acknowledgementFile = req?.files?.acknowledgementFile;

  if (!acknowledgementNumber) {
    return next(new AppError("Acknowledgement Number is required", 400));
  }

  if (!acknowledgementFile) {
    return next(new AppError("Acknowledgement File is required", 400));
  }

  if (!workId) {
    return next(new AppError("workId is required", 400));
  }

  const pancardUser = panCardUsers();
  const data = await pancardUser.findOne({ where: { workId } });

  if (!data) {
    return res.status(404).json({ message: "Record not found" });
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
    await transationHistory.update(
      { status: "success" , service:"Pan Card",},
      { where: { transactionId: workId } }
    );

    await pancardUser.update(
      {
        status: "completed",
        acknowledgementFile:acknowledgementFileUrl,
        acknowledgementNumber,
      },
      { where: { workId } }
    );

    return res.status(200).json({ message: "PAN card completed successfully" });
  } catch (error) {
    return next(new AppError("An error occurred while PAN card completion", 500));
  }
});

const staffPanCardVerify = catchAsync(async (req, res, next) => {
  const { workId} = req.body;

  if (!workId) {
    return next(new AppError("workId is required", 400));
  }

  const pancardUser = panCardUsers();
  const data = await pancardUser.findOne({ where: { workId } });

  if (!data) {
    return res.status(404).json({ message: "Record not found" });
  }

  try {
    await pancardUser.update(
      { ePan: true },
      { where: { workId } }
    );

    return res.status(200).json({ message: "PAN card verified successfully" });
  } catch (error) {
    return next(new AppError("An error occurred while verifying the PAN card", 500));
  }
});


module.exports = { createPancard ,staffPanCardReject,staffPanCardComplete,staffPanCardVerify};
