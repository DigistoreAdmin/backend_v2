const Franchise = require("../db/models/franchise");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

const updateFranchiseBlock = catchAsync(async (req, res, next) => {
    const { uniqueId,block } = req.body;
    
    // Find the franchise by uniqueId
    const franchise = await Franchise.findOne({ uniqueId });
    
    if (!franchise) {
        return next(new AppError('Franchise not found', 404));
    }

    // Update the block state of the franchise
    franchise.block = block;

    await franchise.save();

    res.status(200).json({
        status: 'success',
        data: {
            franchise
        }
    });
});

module.exports = {updateFranchiseBlock};
