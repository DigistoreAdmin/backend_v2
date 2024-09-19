const sequelize = require("../config/database");
const Franchise = require("../db/models/franchise");
const defineStaffsDetails = require("../db/models/staffs");
const User = require("../db/models/user");
const wallets = require("../db/models/wallet");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const { Op } = require("sequelize");

const deleteFranchise = catchAsync(async (req, res, next) => {
    try {
        const { uniqueId } = req.body;

        const franchise = await Franchise.findOne({ where: { franchiseUniqueId: uniqueId } });
        let phoneNumber = null
        if (franchise) {
            phoneNumber = franchise.franchiseUniqueId.slice(3)
        }
        const user = await User.findOne({ where: { phoneNumber } });
        const wallet = await wallets.findOne({ where: { uniqueId } });

        if (franchise) await franchise.destroy({ force: true })
        if (user) await user.destroy({ force: true });
        if (wallet) await wallet.destroy({ force: true });

        return res.status(200).json({ message: 'Franchise details deleted successfully' });
    } catch (error) {
        console.log("Error:", error);
        return next(new AppError("Failed to delete Franchise!", 500));
    }
});

const updateStaffDetails = catchAsync(async (req, res, next) => {
    try {
        const {
            userType,
            employeeId,
            firstName,
            lastName,
            emailId,
            phoneNumber,
            dateOfBirth,
            gender,
            addressLine1,
            addressLine2,
            city,
            district,
            state,
            pinCode,
            bank,
            accountNumber,
            ifscCode,
            accountHolderName,
            dateOfJoin,
            bloodGroup,
            employment,
            employmentType,
            districtOfOperation,
            reportingManager,
            emergencyContact,
            isTrainingRequired,
            totalTrainingDays,
            employmentStartDate,
            laptop,
            idCard,
            sim,
            vistingCard,
            posterOrBroucher,
            other,
            phone,
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

        const updatedStaff = await staffs.update(
            {
                userType,
                employeeId,
                firstName,
                lastName,
                emailId,
                phoneNumber,
                dateOfBirth,
                gender,
                addressLine1,
                addressLine2,
                city,
                district,
                state,
                pinCode,
                bank,
                accountNumber,
                ifscCode,
                accountHolderName,
                dateOfJoin,
                bloodGroup,
                employment,
                employmentType,
                districtOfOperation,
                reportingManager,
                emergencyContact,
                isTrainingRequired,
                totalTrainingDays,
                employmentStartDate,
                laptop,
                idCard,
                sim,
                vistingCard,
                posterOrBroucher,
                other,
                phone,
                remarks,
            },
            {
                where: { employeeId },
            }
        );

        if (!updatedStaff) {
            return res
                .status(400)
                .json({ success: false, message: "Failed to update staff" });
        }

        const updatedStaffs = await staffs.findOne({
            where: { employeeId },
        });

        return res
            .status(200)
            .json({ success: true, message: "Updated staff", staffs: updatedStaffs });
    } catch (error) {
        console.log("Error:", error);
        return next(new AppError(error.message, 500));
    }
});

module.exports = { updateStaffDetails, deleteFranchise };
