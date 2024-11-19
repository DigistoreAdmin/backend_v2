const user = require("../db/models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const otpStorage = require("../utils/otpStorage");
const walletsModel = require("../db/models/wallet");
const defineMoneyTransferDetails = require("../db/models/moneytransferdetails");
const Tokens = require("../utils/token");
const Franchise = require("../db/models/franchise");
const Distributor = require("../db/models/distributor");
const TransationHistory = require("../db/models/transationhistory");
const sequelize = require("../config/database");
const transationHistories = require("../db/models/transationhistory");
const User = require("../db/models/user");
const { generateOTP, sendOTP } = require("../utils/otpUtils");
const student = require("../db/models/student");
const defineStaffsDetails = require("../db/models/staffs");

const senndOtp = catchAsync(async (req, res, next) => {
  try {
    const { mobileNumber } = req.body;
    if (typeof mobileNumber !== "number" || !Number.isInteger(mobileNumber)) {
      console.log("mobileNumber validation failed:", mobileNumber);
      return next(new AppError("mobileNumber must be an integer number", 400));
    }
    const result = await User.findOne({ where: { phoneNumber: mobileNumber } });

    if (result) {
      return next(new AppError("phoneNumber already exist", 401));
    }
    const otp = generateOTP(mobileNumber);
    console.log("otp", otp);

    otpStorage[mobileNumber] = otp; // Save OTP and mobile number

    if (otp == "123456") {
      console.log(otp, "fixed OTP 123456 sent successfully");
      res
        .status(200)
        .json({ success: true, message: "fixed OTP 123456 sent successfully" });
    } else {
      await sendOTP(mobileNumber, otp);
      res.status(200).json({ success: true, message: "OTP sent successfully" });
    }
  } catch (error) {
    console.error(`Error sending OTP: ${error}`);
    res.status(500).json({ error: false, message: "Failed to send OTP" });
  }
});

const checkOTP = (req, res) => {
  try {
    const { mobileNumber, otp } = req.body;

    // Retrieve the OTP from storage
    const storedOTP = otpStorage[mobileNumber];
    console.log("f", storedOTP);

    // Check if OTP is valid
    if (storedOTP && storedOTP == otp) {
      // OTP is valid
      res
        .status(200)
        .json({ success: true, message: "OTP verified successfully" });
    } else {
      // OTP is invalid
      res.status(400).json({ success: false, message: "Invalid OTP" });
    }
  } catch (error) {
    console.error(`Error verifying OTP: ${error}`);
    res.status(500).json({ success: false, message: "Failed to verify OTP" });
  }
};

const verifyOTP = (req, res, next) => {
  const { mobileNumber, otp } = req.body;
  const storedOTP = otpStorage[mobileNumber];
  console.log("otpStore", storedOTP);
  if (!storedOTP) {
    return res.status(400).json({ success: false, message: "Invalid OTP" });
  }
  // OTP is valid
  next(); // Call next to proceed to the next middleware
};

const login = catchAsync(async (req, res, next) => {
  const { phoneNumber, password } = req.body;
  console.log("d", phoneNumber, password);

  if (!phoneNumber || !password) {
    return next(new AppError("Please provide phoneNumber and password", 400));
  }
  const data = await user.findOne({ where: { phoneNumber } });
  // console.log("1",data);
  if (!data || !(await bcrypt.compare(password, data.password))) {
    console.log("lbh");
    return next(new AppError("Incorrect phoneNumber or password", 401));
  }

  console.log("type", data.userType);
  let d = data.userType;
  const accessTokenExpiresIn = 24 * 60 * 60 * 1000; // 1 day in milliseconds
  const refreshTokenExpiresIn = 30 * 24 * 60 * 60 * 1000; // 30 days in milliseconds
  // //for testing
  // const accessTokenExpiresIn = 1 * 60 * 1000; // 1 minute in milliseconds
  // const refreshTokenExpiresIn = 2 * 60 * 1000; // 2 minutes in milliseconds
  // //for testing
  switch (data.userType) {
    case "franchise": {
      console.log("2", data.userType);
      const existingUser = await Franchise.findOne({ where: { phoneNumber } });
      if (!existingUser) {
        return next(new AppError("phoneNumber does not exist", 401));
      }

      if (!(await existingUser.isPasswordMatch(password))) {
        return next(new AppError("Password does not match", 401));
      }

      const { accessToken, refreshToken } = await Tokens.generateTokens({
        email: existingUser.email,
        userType: data.userType,
      });

      const {
        password: userPassword,
        accountNumber,
        ifscCode,
        aadhaarNumber,
        panNumber,
        aadhaarPicFront,
        aadhaarPicback,
        panPic,
        bankPassbookPic,
        ...sanitizedDataValues
      } = existingUser.dataValues;

      return res
        .cookie("accessToken", accessToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV,
          sameSite: "None",
          maxAge: accessTokenExpiresIn, // Set the expiration time for the access token cookie
        })
        .cookie("refreshToken", refreshToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV,
          sameSite: "None",
          maxAge: refreshTokenExpiresIn, // Set the expiration time for the refresh token cookie
        })
        .status(200)
        .json({
          message: "Login success franchise",
          data: sanitizedDataValues,
        });

      // .status(200)
      // .json({
      //   message: "Login success franchise",
      //   data: sanitizedDataValues,
      //   accessToken: accessToken,
      //   refreshToken: refreshToken
      // });
    }

    case "distributor": {
      let existingUser;
      existingUser = await Distributor.findOne({
        where: { mobileNumber: phoneNumber },
      });

      if (!existingUser) {
        return next(new AppError("phoneNumber not exist", 401));
      }
      const { accessToken, refreshToken } = await Tokens.generateTokens({
        email: existingUser.email,
        userType: data.userType,
      });
      const {
        ifscCode,
        accountName,
        accountNumber,
        aadhaarNumber,
        aadhaarfrontImage,
        aadhaarBackImage,
        panNumber,
        panCardImage,
        bankPassbook,
        aadhaarFrontImage,
        bankPassbookImage,
        password,
        ...sanitizedDataValues
      } = existingUser.dataValues;

      return res
        .cookie("accessToken", accessToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV,
          sameSite: "None",
          maxAge: accessTokenExpiresIn,
        })
        .cookie("refreshToken", refreshToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV,
          sameSite: "None",
          maxAge: refreshTokenExpiresIn,
        })
        .status(200)
        .json({
          message: "Login success distributor",
          data: sanitizedDataValues,
        });
    }
    case "admin": {
      let existingUser;
      existingUser = await user.findOne({
        where: { phoneNumber: phoneNumber },
      });

      if (!existingUser) {
        return next(new AppError("phoneNumber not exist", 401));
      }
      const { accessToken, refreshToken } = await Tokens.generateTokens({
        email: existingUser.email,
        userType: data.userType,
      });
      const { password, ...sanitizedDataValues } = existingUser.dataValues;

      return res
        .cookie("accessToken", accessToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV,
          sameSite: "None",
          maxAge: accessTokenExpiresIn,
        })
        .cookie("refreshToken", refreshToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV,
          sameSite: "None",
          maxAge: refreshTokenExpiresIn,
        })
        .status(200)
        .json({
          message: "Login success distributor",
          data: sanitizedDataValues,
        });
    }
    case "student": {
      let existingUser;
      existingUser = await student.findOne({
        where: { mobileNumber: phoneNumber },
      });

      if (!existingUser) {
        return next(new AppError("phoneNumber not exist", 401));
      }
      const { accessToken, refreshToken } = await Tokens.generateTokens({
        email: existingUser.email,
        userType: data.userType,
      });
      const { password, ...sanitizedDataValues } = existingUser.dataValues;

      return res
        .cookie("accessToken", accessToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV,
          sameSite: "None",
          maxAge: accessTokenExpiresIn,
        })
        .cookie("refreshToken", refreshToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV,
          sameSite: "None",
          maxAge: refreshTokenExpiresIn,
        })
        .status(200)
        .json({
          message: "Login success student",
          data: sanitizedDataValues,
        });
    }
    case "staff": {
      let existingUser;
      const staffs = defineStaffsDetails();
      existingUser = await staffs.findOne({
        where: { phoneNumber: phoneNumber },
      });

      if (!existingUser) {
        return next(new AppError("phoneNumber not exist", 401));
      }
      const { accessToken, refreshToken } = await Tokens.generateTokens({
        email: existingUser.email,
        userType: data.userType,
      });
      const { password, ...sanitizedDataValues } = existingUser.dataValues;

      return res
        .cookie("accessToken", accessToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV,
          sameSite: "None",
          maxAge: accessTokenExpiresIn,
        })
        .cookie("refreshToken", refreshToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV,
          sameSite: "None",
          maxAge: refreshTokenExpiresIn,
        })
        .status(200)
        .json({
          message: "Login success student",
          data: sanitizedDataValues,
        });
    }
    case "accountant":{
      let existingUser; 
      existingUser= await user.findOne({
        where:{phoneNumber:phoneNumber}
      })

      if(!existingUser){
        return next(new AppError("phoneNumber not exist",401))
      }
      const {accessToken, refreshToken}= await Tokens.generateTokens({
        email:existingUser.email,
        userType:data.userType,
      })
      const {password,...sanitizedDataValues}=existingUser.dataValues

      return res
        .cookie("accessToken", accessToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV,
          sameSite: "None",
          maxAge: accessTokenExpiresIn,
        })
        .cookie("refreshToken", refreshToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV,
          sameSite: "None",
          maxAge: refreshTokenExpiresIn,
        })
        .status(200)
        .json({
          message: "Login success accountant",
          data: sanitizedDataValues,
        });
    }

    default: {
      return next(new AppError("Invalid user type", 400));
    }
  }
});

const logout = catchAsync(async (req, res, next) => {
  res
    .clearCookie("accessToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV,
      sameSite: "None",
    })
    .clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV,
      sameSite: "None",
    })
    .status(200)
    .json({ message: "Logout successful" });
});

const authentication = catchAsync(async (req, res, next) => {
  // 1. get the token from headers
  let idToken = "";
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    // Bearer asfdasdfhjasdflkkasdf
    idToken = req.headers.authorization.split(" ")[1];
  }
  if (!idToken) {
    return next(new AppError("Please login to get access", 401));
  }
  // 2. token verification
  const tokenDetail = jwt.verify(idToken, process.env.ACCESS_TOKEN_PRIVATE_KEY);
  // 3. get the user detail from db and add to req object
  const freshUser = await user.findByPk(tokenDetail.id);

  if (!freshUser) {
    return next(new AppError("User no longer exists", 400));
  }
  req.user = freshUser;
  return next();
});

const restrictTo = (...userType) => {
  const checkPermission = (req, res, next) => {
    if (!userType.includes(req.user.userType)) {
      return next(
        new AppError("You don't have permission to perform this action", 403)
      );
    }
    return next();
  };

  return checkPermission;
};

function generateRandomNumber() {
  const randomNumber =
    Math.floor(Math.random() * (999999999999 - 100000000000 + 1)) +
    100000000000;
  return randomNumber.toString();
}

// change password functionality
const changePassword = catchAsync(async (req, res, next) => {
  const userData = req.user;
  if (!userData) {
    return next(new AppError("User not found", 404));
  }
  const Data = await user.findOne({ where: { email: userData.email } });
  const franchiseData = await Franchise.findOne({
    where: { email: userData.email },
  });
  if (!Data || !franchiseData) {
    return next(new AppError("User not found", 404));
  }
  // const phoneNumber =Data.phoneNumber
  // console.log(phoneNumber)where: { phoneNumber }

  const { currentPassword, newPassword, confirmPassword } = req.body;

  if (!currentPassword || !newPassword || !confirmPassword) {
    return next(new AppError("All fields are required", 400));
  }

  if (newPassword !== confirmPassword) {
    return next(
      new AppError("New password and confirm password doesn't match", 400)
    );
  }

  const isMatch =
    (await bcrypt.compare(currentPassword, Data.password)) &&
    (await bcrypt.compare(currentPassword, franchiseData.password));
  if (!isMatch) {
    return next(new AppError("Current password is incorrect", 400));
  }

  const hashedPassword = await bcrypt.hash(newPassword, 8);

  Data.password = hashedPassword;
  await Data.save();
  franchiseData.password = hashedPassword;
  await franchiseData.save();

  res.status(200).json({
    status: "success",
    message: "Password changed successfully",
  });
});

module.exports = {
  senndOtp,
  checkOTP,
  login,
  authentication,
  restrictTo,
  verifyOTP,
  logout,
  changePassword,
};
