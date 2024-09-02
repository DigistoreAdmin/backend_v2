const Franchise = require('../db/models/franchise');
const panCardUsers = require('../db/models/pancard');
const azureStorage = require('azure-storage');
const intoStream = require('into-stream');

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
      isCollege,
      isDuplicateOrChangePan,
      assignedId,
      customerName,
      emailID,
      mobileNumber,
      fatherName,
      collegeID,
      coordinatorID,
      coordinatorName,
      reasonForDuplicate,
      panNumber,
      representativeName,
      representativeAddress,
      representativeRelatiion,
      nriAddress,
      nameChange,
      addressChange,
      dobChange,
      changeFatherName,
    } = req.body;

    const {
      signatureChange,
      photoChange,
      proofOfIdentity,
      proofOfDOB,
      proofOfAddress,
      representativeDocument,
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
    const signatureChangeUrl = await uploadFile(signatureChange);
    const photoChangeUrl = await uploadFile(photoChange);
    const representativeDocumentUrl = await uploadFile(representativeDocument);
    
    const inputData = {
      nameChange:nameChange,
      addressChange:addressChange,
      dobChange:dobChange,
      changeFatherName:changeFatherName,
      signatureChangeUrl:signatureChangeUrl,
      photoChangeUrl:photoChangeUrl,
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
      emailID,
      mobileNumber,
      fatherName,
      proofOfIdentity: proofOfIdentityUrl,
      proofOfDOB: proofOfDOBUrl,
      proofOfAddress: proofOfAddressUrl,
      isCollege,
      collegeID,
      coordinatorID,
      coordinatorName,
      isDuplicateOrChangePan,
      reasonForDuplicate,
      panNumber,
      nameChange: processedData.nameChange,
      addressChange: processedData.addressChange,
      dobChange: processedData.dobChange,
      changeFatherName: processedData.changeFatherName,
      signatureChange: processedData.signatureChangeUrl,
      photoChange: processedData.photoChangeUrl,
      representativeName,
      representativeAddress,
      representativeRelatiion,
      representativeDocument: representativeDocumentUrl,
      nriAddress,
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

module.exports = { createPancard };
