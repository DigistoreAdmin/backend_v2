const sequelize = require("../../config/database");
const transationHistories = require("../../db/models/transationhistory");
const catchAsync = require("../../utils/catchAsync");
const {Op} = require("sequelize");


const mostCommisionedFranchise=catchAsync(async(req,res)=>{
    const {startDate, endDate} = req.query;

    let whereCondition={}
    if(startDate && endDate){
        whereCondition.createdAt = {};
        if (startDate) {
            whereCondition.createdAt[Op.gte] = new Date(startDate);
        }
        if (endDate) {
            whereCondition.createdAt[Op.lte] = new Date(endDate);
        }
    }
    const result =await transationHistories.findAll({ 
        attributes: [
        'uniqueId',
        [sequelize.fn('SUM', sequelize.col('franchiseCommission')), 'totalCommission']
    ],
    where:whereCondition,
    group: ['uniqueId'],
    order: [[sequelize.fn('SUM', sequelize.col('franchiseCommission')), 'DESC']],
    limit:5,
    raw: true,
})

if (!result || result.length === 0) {
    return res.status(404).json({
        status: 'fail',
        message: 'No commission data found',
    });
}
console.log('result: ', result);

res.status(200).json({
    status: 'success',
    data: result,
});
})

module.exports={
    mostCommisionedFranchise
}