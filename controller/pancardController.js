const Franchise = require('../db/models/franchise');
const panCardUsers = require('../db/models/pancard');
const azureStorage = require('azure-storage');
const intoStream = require('into-stream');
const transationHistory = require('../db/models/transationhistory')
const wallets = require('../db/models/wallet');
const catchAsync = require('../utils/catchAsync');

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

const createPancard = async (req, res) => {
  try {
    const {
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
    if (!newPancardUser) {
      return res.status(400).json({
        status: 'fail',
        message: 'Invalid data',
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

const updatePanDetails = catchAsync(async (req, res,next) => {
  try {
    const { phoneNumber,id,status, acknowledgementNumber, reason, ePan,accountNo } =
      req.body;
    console.log("req.body: ", req.body);
    const acknowledgementFile = req?.files?.acknowledgementFile;

    const user=req.user


    if (!phoneNumber) {
      return res.status(400).json({ message: "Mobile number is required" });
    }

    const pancardUser = panCardUsers();

    const report = await pancardUser.findOne({
      where: { phoneNumber: phoneNumber ,id:id},
    });

    if (!report) {
      return res.status(404).json({ message: "Record not found" });
    }

    const franchiseData = await Franchise.findOne({
      where: { email: user.email },
    });
    
    if (!franchiseData) return next(new AppError("Franchise not found", 404));
    
    
    const walletData = await wallets.findOne({
      where: { uniqueId: franchiseData.franchiseUniqueId },
    });
    
    if (!walletData) return next(new AppError("Wallet not found", 404));
    

    const finalStatus = status === "completed" ? "completed" : "inProgress";

    const uploadFile = async (file) => {
      if (file) {
        try {
          return await uploadBlob(file);
        } catch (error) {
          console.error(`Error uploading file ${file.name}:`, error);
          throw new Error("File upload failed");
        }
      }
      return null;
    };

    const acknowledgementFileUrl = await uploadFile(acknowledgementFile);

    
    let totalAmount = 1500;
    let commissionToHO = 1000;
    let commissionToFranchise = 500;

    report.status = finalStatus;
    report.acknowledgementFile =
      acknowledgementFileUrl || report.acknowledgementFile;
    report.acknowledgementNumber =
      acknowledgementNumber || report.acknowledgementNumber;
    report.reason = reason || report.reason;
    report.ePan = ePan || report.ePan;
    
    report.totalAmount = totalAmount || report.totalAmount;
    report.commissionToHO =
      commissionToHO || report.commissionToHO;

      report.commissionToFranchise =
      commissionToFranchise || report.commissionToFranchise;

  
      if(totalAmount > walletData.balance){
        return next(new AppError("Insufficient wallet balance", 401));
        }
  
      await report.save();
  
      const newBalance =Math.round(walletData.balance-totalAmount)
  
      
      // Update wallet balance
      const updated = await wallets.update(
        { balance: newBalance },
        { where: { uniqueId: franchiseData.franchiseUniqueId } }
      );
  
      const transactionId=generateRandomId()
  
    const newTransactionHistory = await transationHistory.create({
        transactionId: transactionId,
        uniqueId: franchiseData.franchiseUniqueId,
        userName: franchiseData.franchiseName,
        userType: user.userType,
        service: "pancard",
        customerNumber: phoneNumber,
        serviceNumber: accountNo,
        serviceProvider: "pancard",
        status: "success",
        amount: totalAmount,
        franchiseCommission: commissionToFranchise,
        adminCommission: commissionToHO,
        walletBalance: newBalance,
      });
  
    if (newTransactionHistory && updated) {
    return res.status(200).json({
      message: `success`,
      report,
    });
  }
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "An error occurred", error: error.message });
  }
});

function generateRandomId() {
  const prefix = "DSP";
  const timestamp = Date.now().toString(); 
  return prefix + timestamp;
}

module.exports = { createPancard, updatePanDetails };
