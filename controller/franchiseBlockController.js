const Franchise = require("../db/models/franchise");
const User = require("../db/models/user")
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const { where } = require("sequelize");

const updateFranchiseBlock = catchAsync(async (req, res, next) => {

    const { uniqueId, blockStatus } = req.body;

    const franchise = await Franchise.findOne({ where: { franchiseUniqueId: uniqueId } });
    const user = franchise ? await User.findOne({ where: { email: franchise.email } }) : null
    if (!franchise || !user) {
        return next(new AppError('Franchise not found', 404));
    }

    franchise.blocked = blockStatus;
    await franchise.save();

    user.blocked = blockStatus;
    await user.save()

    res.status(200).json({
        status: 'success',
        data: {
            franchise,
            user
        },
        message: `Franchise blocked status updated to ${blockStatus}`
    });
});

module.exports = { updateFranchiseBlock };