const Franchise = require("../db/models/franchise");
const user = require("../db/models/user");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const { generateOTP, sendOtpForgotPassword } = require("../utils/otpUtils");
const bcrypt = require('bcrypt')

//forgotPassword
const sendOtp = catchAsync(async (req, res, next) => {
    const { phoneNumber } = req.body;
    console.log(phoneNumber);

    delete req.session.otp;
    delete req.session.otpExpiration;

    if (!phoneNumber) {
        return next(new AppError("phoneNumber is needed", 400));
    }

    if (typeof phoneNumber !== "number" || !Number.isInteger(phoneNumber)) {
        console.log("phoneNumber validation failed:", phoneNumber);
        return next(new AppError("phoneNumber must be an integer number", 400));
    }

    const result = await user.findOne({ where: { phoneNumber } }) && await Franchise.findOne({ where: { phoneNumber } });

    if (!result) {
        return next(new AppError("phoneNumber not found", 404));
    }

    const newOtp = generateOTP(phoneNumber);
    console.log("otp", newOtp);
    req.session.otp = newOtp;
    req.session.phoneNumber = phoneNumber;
    req.session.otpExpiration = new Date(Date.now() + 6 * 60 * 1000);
    if (newOtp === "123456") {
        res
            .status(200)
            .json({ success: true, message: "fixed OTP 123456 sent successfully" });
    } else {
        await sendOtpForgotPassword(phoneNumber, newOtp);
        res.status(200).json({ success: true, message: "OTP sent successfully" });
    }
});


//verify otp
const verifyOtp = catchAsync(async (req, res, next) => {
    const { otp, phoneNumber } = req.body;

    if (
        !req.session.otp ||
        !req.session.otpExpiration ||
        !req.session.phoneNumber
    ) {
        return next(new AppError("Session data missing", 400))
    }

    if (new Date() > new Date(req.session.otpExpiration)) {
        return next(new AppError("OTP has expired", 400))
    }

    if (otp === req.session.otp && phoneNumber === req.session.phoneNumber) {
        req.session.isOtpVerified = true;
        return res.status(200).json({
            status: "success",
            message: "OTP verified successfully",
        });
    } else {
        req.session.isOtpVerified = false;
        return next(new AppError("Invalid OTP or phone number", 400))
    }
});


//Reset password
const resetPassword = catchAsync(async (req, res, next) => {
    const { newPassword, confirmPassword } = req.body;

    if(!newPassword || !confirmPassword){
        return next(new AppError("newPassword and confirmPassword are needed", 400))
    }

    if (!req.session.isOtpVerified || !req.session.phoneNumber) {
        return next(new AppError("OTP not verified or session data missing", 400))
    }

    if (newPassword !== confirmPassword) {
        return next(new AppError("Passwords do not match", 400))
    }

    try {
        const userToUpdate = await user.findOne({ where: { phoneNumber: req.session.phoneNumber } });
        const franchiseToUpdate = await Franchise.findOne({ where: { phoneNumber: req.session.phoneNumber } });

        if (!userToUpdate || !franchiseToUpdate) {
            return next(new AppError("User not found", 404))
        }

        // Hash the new password before saving
        const hashedPassword = await bcrypt.hash(newPassword, 8);
        userToUpdate.password = hashedPassword;
        const updatedUserPassword = await userToUpdate.save();
        if(!updatedUserPassword){
            return next(new AppError("Error in updating password",400))
        }

        franchiseToUpdate.password = hashedPassword;
        const updatedFranchisePassword = await franchiseToUpdate.save();
        if(!updatedFranchisePassword){
            return next(new AppError("Error in updating password",400))
        }

        // Clear the session data
        delete req.session.otp;
        delete req.session.otpExpiration;
        delete req.session.phoneNumber;
        delete req.session.isOtpVerified;

        return res.status(200).json({
            status: "success",
            message: "Password updated successfully",
        });
    } catch (error) {
        return next(error);
    }
});

module.exports = {
    sendOtp,
    verifyOtp,
    resetPassword
}  