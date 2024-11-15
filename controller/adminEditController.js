const Wallet = require("../db/models/wallet");
const TransactionHistory = require("../db/models/transationhistory");
const Franchise = require("../db/models/franchise");
const defineStaffsDetails = require("../db/models/staffs");
const User = require("../db/models/user");
const wallets = require("../db/models/wallet");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const crypto = require("crypto")

const kswift = require("../db/models/kswift");
const trainBooking = require("../db/models/trainbooking")
const udyamRegistrations = require("../db/models/udyamregistration");
const financialstatements = require("../db/models/financialstatements");
const companyFormations = require("../db/models/companyformation")
const BusBooking = require("../db/models/busbooking");
const fssaiRegistrations = require("../db/models/fssairegistration");
const fssaiLicences = require("../db/models/fssailicence");
const gstRegistrationDetails = require("../db/models/gstregistration");
const gstFilings = require("../db/models/gstfiling");
const incomeTaxFilingDetails = require("../db/models/incometax");
const partnerShipDeedTable = require("../db/models/partnershipdeedpreperation");
const packingLicence = require("../db/models/packinglicences");
const defineVehicleInsurance = require("../db/models/vehicleInsurance")
const loanAgainstProperty = require("../db/models/loanAgainstProperty");
const defineBusinessLoanUnscuredExisting = require("../db/models/BusinessLoanUnsecuredExisting");
const defineHousingLoan = require("../db/models/HousingLoan");
const defineBusinessLoanNewSecured = require("../db/models/businessLoanNewSecured");
const newVehicleLoan = require("../db/models/newvehicleloan");
const usedVehicleLoan = require("../db/models/vehicleloanused");
const definePersonalLoan = require("../db/models/personalloan");
const defineBusinessLoanUnsecuredNew = require("../db/models/businessloanunsecurednew");
const businessLoanExistingDetails = require("../db/models/businessloanexisting")
const definePancardUser = require("../db/models/pancard");
const definePassportDetails = require("../db/models/passport");
const microLoans = require("../db/models/microloan");
const medicalInsuranceData = require("../db/models/medicalinsurance");
const microLoanShop = require("../db/models/microloansshop");


const { Op, where } = require("sequelize");
const bcrypt = require("bcrypt");
const azureStorage = require('azure-storage');
const intoStream = require('into-stream');
const user = require("../db/models/user");
const sequelize = require("../config/database");
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

const deleteFranchise = catchAsync(async (req, res, next) => {
  const transaction = await sequelize.transaction();

  try {
    const { uniqueId } = req.body;

    const franchise = await Franchise.findOne({ where: { franchiseUniqueId: uniqueId }, transaction });
    let phoneNumber = null;
    if (franchise) {
      phoneNumber = franchise.franchiseUniqueId.slice(3);
    }

    const user = await User.findOne({ where: { phoneNumber }, transaction });
    const wallet = await wallets.findOne({ where: { uniqueId }, transaction });

    if (franchise) await franchise.destroy({ force: true, transaction });
    if (user) await user.destroy({ force: true, transaction });
    if (wallet) await wallet.destroy({ force: true, transaction });

    await transaction.commit();

    return res.status(200).json({ message: 'Franchise details deleted successfully' });
  } catch (error) {
    await transaction.rollback();

    console.error("Error:", error);
    return next(new AppError("Failed to delete Franchise!", 500));
  }
});



const updateStaffDetails = catchAsync(async (req, res, next) => {

    try {
        const {
          employeeId,  
          firstName,
          lastName,
          dateOfBirth,
          gender,
          employment,
          employmentType,
          addressLine1,
          addressLine2,
          emergencyContact,
          districtOfOperation,
          reportingManager,
          dateOfJoin,
          isTrainingRequired,
          totalTrainingDays,
          employmentStartDate,
          city,
          district,
          state,
          pinCode,
          bank,
          accountNumber,
          branchName,
          ifscCode,
          accountName,
          bloodGroup,
          laptop,
          idCard,
          sim,
          phone,
          vistingCard,
          posterOrBroucher,
          other,
          laptopDetails,
          idCardDetails,
          phoneDetails,
          simDetails,
          vistingCardDetails,
          posterOrBroucherDetails,
          otherDetails,
          remarks,
        } = req.body;

        const staffs = defineStaffsDetails();

        const findStaff = await staffs.findOne({
            where: { employeeId },
        });

        if (!findStaff) {
            return res
                .status(404)
                .json({ success: false, message: "Staff not found" });
        }

        const uploadFile = async (file) => {
          if (file) {
            try {
              return await uploadBlob(file);
            } catch (error) {
              console.error(`Error uploading file ${file.name}:`, error);
              // return null;
            }
          } else {
            console.error('File is missing:', file);
            // return null;
          }
        };

        const profilePic = req?.files?.profilePic
        const profilePicUrl = await uploadFile(profilePic)

        const updatedStaff = await staffs.update(
            { 
              firstName,
              lastName,
              profilePic:profilePicUrl,
              dateOfBirth,
              gender,
              employment,
              employmentType,
              addressLine1,
              addressLine2,
              emergencyContact,
              districtOfOperation,
              reportingManager,
              dateOfJoin,
              isTrainingRequired,
              totalTrainingDays,
              employmentStartDate,
              city,
              district,
              state,
              pinCode,
              bank,
              accountNumber,
              branchName,
              ifscCode,
              accountName,
              bloodGroup,
              laptop,
              idCard,
              sim,
              phone,
              vistingCard,
              posterOrBroucher,
              other,
              laptopDetails,
              idCardDetails,
              phoneDetails,
              simDetails,
              vistingCardDetails,
              posterOrBroucherDetails,
              otherDetails,
              remarks,
            },
            {
                where: { employeeId: findStaff.employeeId },
            }
        );

        if (!updatedStaff) {
            return res
                .status(400)
                .json({ success: false, message: "Failed to update staff" });
        }

        const updatedStaffs = await staffs.findOne({
            where: { employeeId: findStaff.employeeId },
        });


    return res
      .status(200)
      .json({ success: true, message: "Updated staff", staffs: updatedStaffs });
  } catch (error) {
    console.log("Error:", error);
    return next(new AppError(error.message, 500));
  }
});

const updateFranchiseDetails = catchAsync(async (req, res, next) => {
  const transaction = await sequelize.transaction();
  try {
    const {
      franchiseUniqueId,
      ownerName,
      franchiseName,
      businessType,
      phoneNumber,
      email,
      gender,
      dateOfBirth,
      franchiseAddressLine1,
      franchiseAddressLine2,
      state,
      district,
      pinCode,
      postOffice,
      panchayath,
      ward,
      digitalElements,
      panCenter,
      accountNumber,
      accountName,
      bank,
      branchName,
      ifscCode,
      aadhaarNumber,
      panNumber,
      referredBy,
      referredFranchiseName,
      referredFranchiseCode,
      onBoardedBy,
      onBoardedPersonId,
      onBoardedPersonName,
      userPlan,
    } = req.body;

    const aadhaarPicFront = req?.files?.aadhaarPicFront
    const aadhaarPicback = req?.files?.aadhaarPicback
    const panPic = req?.files?.panPic
    const bankPassbookPic = req?.files?.bankPassbookPic
    const shopPic = req?.files?.shopPic

    const uploadFile = async (file) => {
      if (file) {
        try {
          return await uploadBlob(file);
        } catch (error) {
          console.error(`Error uploading file ${file.name}:`, error);
          // return null;
        }
      } else {
        console.error('File is missing:', file);
        // return null;
      }
    };

    const aadhaarPicFrontUrl = await uploadFile(aadhaarPicFront);
    const aadhaarPicBackUrl = await uploadFile(aadhaarPicback);
    const panPicUrl = await uploadFile(panPic);
    const bankPassbookPicUrl = await uploadFile(bankPassbookPic);
    const shopPicUrl = await uploadFile(shopPic);

    const franchise = await Franchise.findOne({
      where: { franchiseUniqueId },
      transaction,
    });

    if (!franchise) {
      return res
        .status(404)
        .json({ success: false, message: "Franchise not found" });
    }

    const algorithm = "aes-192-cbc";
    const secret = process.env.FRANCHISE_SECRET_KEY;
    const key = crypto.scryptSync(secret, "salt", 24);

    const encryptData = (data) => {
      const iv = crypto.randomBytes(16);
      const cipher = crypto.createCipheriv(algorithm, key, iv);

      let encrypted = cipher.update(data, "utf8", "hex");
      encrypted += cipher.final("hex");

      return iv.toString("hex") + ":" + encrypted;
    };

    let hashPan;
    panNumber && typeof panNumber === "string"
      ? (hashPan = encryptData(panNumber))
      : panNumber;

    let hashAadhaar;
    aadhaarNumber && typeof aadhaarNumber === "string"
      ? (hashAadhaar = encryptData(aadhaarNumber.toString()))
      : aadhaarNumber;

    let hashAccountN;
    accountNumber && typeof accountNumber === "string"
      ? (hashAccountN = encryptData(accountNumber.toString()))
      : accountNumber;

    const updateUserDetails = await user.update(
      {
        email,
        phoneNumber
      },
      {
        where: {
          email: franchise.email,
          phoneNumber: franchise.phoneNumber,
        },
        transaction,
      }
    );

    if (!updateUserDetails) {
      await transaction.rollback();
      throw new AppError("Failed to update user details", 400);
    }

    const updatedFranchise = await Franchise.update(
      {
        ownerName,
        franchiseName,
        businessType,
        phoneNumber,
        email,
        gender,
        dateOfBirth,
        franchiseAddressLine1,
        franchiseAddressLine2,
        state,
        district,
        pinCode,
        postOffice,
        panchayath,
        ward,
        digitalElements,
        panCenter,
        accountNumber: hashAccountN,
        accountName,
        bank,
        branchName,
        ifscCode,
        aadhaarNumber: hashAadhaar,
        panNumber: hashPan,
        referredBy,
        referredFranchiseName,
        referredFranchiseCode,
        onBoardedBy,
        onBoardedPersonId,
        onBoardedPersonName,
        userPlan,
        aadhaarPicFront: aadhaarPicFrontUrl,
        aadhaarPicback: aadhaarPicBackUrl,
        panPic: panPicUrl,
        bankPassbookPic: bankPassbookPicUrl,
        shopPic: shopPicUrl,
      },
      {
        where: { franchiseUniqueId },
      },
      transaction,
    );

    if (!updatedFranchise) {
      await transaction.rollback();
      throw new AppError("Failed to update the franchise", 400);
    }

    const updatedFranchises = await Franchise.findOne({
      where: { franchiseUniqueId },
    });

    await transaction.commit();

    return res.status(200).json({
      success: true,
      message: "Franchise details updated",
      updatedFranchises,
    });
  } catch (error) {
    await transaction.rollback();
    console.error("Error:", error);
    return next(new AppError(error.message, 500));
  }
});

const updateWallet = catchAsync(async (req, res, next) => {
  try {
    const { uniqueId, amount } = req.body;
    // {"credit":500} or {"debit":500} - amount

    if (!amount) {
      return res.status(400).json({ message: "Amount is required" });
    }

    const wallet = await Wallet.findOne({
      where: { uniqueId },
    });

    const transactionHistory = await TransactionHistory.findOne({
      where: { uniqueId },
    });

    const franchise = await Franchise.findOne({
      where: { franchiseUniqueId: uniqueId },
    });

    if (!wallet && !transactionHistory && !franchise) {
      return next(new AppError("Franchise not found", 404));
    }

    const random12DigitNumber = generateRandomNumber();
    let DSP = `DSP${random12DigitNumber}${franchise.id}`;

    const sum = (a, b) => {
      return (parseFloat(a) + parseFloat(b)).toFixed(2);
    };
    const sub = (a, b) => {
      return (parseFloat(a) - parseFloat(b)).toFixed(2);
    };

    let amountValue = JSON.parse(amount);

    if (
      (amountValue.credit && ((typeof amountValue.credit != "number") || amountValue.credit <= 0) || (amountValue.credit === 0)) ||
      (amountValue.debit && ((typeof amountValue.debit != "number") || amountValue.debit <= 0) || (amountValue.debit === 0))
    ) {
      return res.status(400).json({ message: "Enter a valid amount" });
    }

    let credited =
      amountValue.credit && sum(wallet.balance, amountValue.credit);
    let debited = amountValue.debit && sub(wallet.balance, amountValue.debit);
    let servicez = "";
    credited
      ? (servicez = "Wallet Credite")
      : (servicez = "Wallet Debite");

    console.log("balance", wallet.balance);
    console.log("updated balance", credited, debited);

    const updatedW = await Wallet.update(
      { balance: credited || debited },
      { where: { uniqueId: wallet.uniqueId } }
    );

    const transactionH = await TransactionHistory.create(
      {
        transactionId: DSP,
        uniqueId: franchise.franchiseUniqueId,
        userName: franchise.franchiseName,
        userType: franchise.userType,
        service: servicez,
        serviceProvider:":Admin",
        amount: amountValue.credit || amountValue.debit,
        walletBalance: credited || debited,
        status: "success",
      },
      { where: { uniqueId: uniqueId } }
    );


    if (updatedW && transactionH) {
      res.status(200).json({
        success: true,
        message: "amount updated success",
        updatedH: transactionH,
        updatedW: updatedW,
      });
    }
  } catch (error) {
    console.error("Error:", error);
    return next(new AppError(error.message, 500));
  }
});

const verifyFranchise = catchAsync(async (req, res, next) => {
  const { uniqueId, value } = req.body;

  const franchise = await Franchise.findOne({
    where: { franchiseUniqueId: uniqueId },
  });

  if (!franchise) {
    return next(new AppError("Franchise not found", 404));
  }

  await franchise.update({ verified: value });

  res.status(200).json({
    status: 'success',
    message: 'Verification Status Updated',
  });
})

const staffAssign = catchAsync(async (req, res, next) => {

  const { workId, assignedId } = req.body;
  const gstRegistration = await gstRegistrationDetails();
  const passport = await definePassportDetails();
  const incomeTaxTable = await incomeTaxFilingDetails();
  const vehicleInsurance = await defineVehicleInsurance();
  const panCard = await definePancardUser();
  const loanAgainstPropertyDetails = await loanAgainstProperty();
  const defineBusinessLoanUnsecuredExistingDetails = await defineBusinessLoanUnscuredExisting();
  const defineHousingLoanDetails = await defineHousingLoan();
  const defineBusinessLoanNewSecuredDetails = await defineBusinessLoanNewSecured();
  const newVehicleLoanDetails = await newVehicleLoan();
  const usedVehicleLoanDetails = await usedVehicleLoan();
  const definePersonalLoanDetails = await definePersonalLoan();
  const defineBusinessLoanUnsecuredNewDetails = await defineBusinessLoanUnsecuredNew();
  const businessLoanExistingDetailsDetails = await businessLoanExistingDetails();
  const medicalInsurance = await medicalInsuranceData();


  const tables = [
    kswift, 
    fssaiRegistrations,
    fssaiLicences,
    udyamRegistrations, 
    financialstatements, 
    companyFormations,
    packingLicence, 
    partnerShipDeedTable, 
    gstRegistration,
    gstFilings, 
    passport,
    BusBooking,
    trainBooking,
    panCard,
    microLoans,
    medicalInsurance,
    microLoanShop,
    incomeTaxTable,
    vehicleInsurance,
    loanAgainstPropertyDetails,
    defineBusinessLoanUnsecuredExistingDetails,
    defineBusinessLoanNewSecuredDetails,
    defineHousingLoanDetails,
    newVehicleLoanDetails,
    usedVehicleLoanDetails,
    definePersonalLoanDetails,
    defineBusinessLoanUnsecuredNewDetails,
    businessLoanExistingDetailsDetails,
];


  const results = await Promise.all(
    tables.map((table) => table.findOne({ where: { workId } }))
  );

  const index = results.findIndex((record) => record !== null);

  if (index === -1) {
    return next(new AppError("Service not found", 404));
  }

  await tables[index].update(
    { assignedId: assignedId, assignedOn: new Date() },
    { where: { workId } }
  );

  res.status(200).json({
    status: 'success',
    message: 'Staff assigned successfully',
  });
});


function generateRandomNumber() {
  const randomNumber =
    Math.floor(Math.random() * (999999999999 - 100000000000 + 1)) +
    100000000000;
  return randomNumber.toString();
}

const deleteStaff = catchAsync(async (req, res, next) => {
  const { employeeId } = req.body;
  console.log('employeeId: ', employeeId);

  if (!employeeId) {
    return next(new AppError('employeeId is required', 400));
  }

  const staffTable = defineStaffsDetails();
  const staff = await staffTable.findOne({ where: { employeeId } });

  if (!staff) {
    return next(new AppError('No staff found with that employeeId', 404));
  }
  const { email, phoneNumber } = staff
  await staffTable.destroy({ where: { employeeId }, force: true });

  const userData = await User.findOne({ where: { email, phoneNumber } })
  if (userData) {
    await User.destroy({ where: { email, phoneNumber }, force: true })
  }

  return res.status(200).json({
    status: 'success',
    message: "Staff data deleted successfully",
    data: null,
  });
});




module.exports = {
  updateStaffDetails, deleteFranchise, updateFranchiseDetails, updateWallet, verifyFranchise,
  deleteStaff,staffAssign
};

