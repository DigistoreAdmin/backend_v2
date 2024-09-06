const Franchise = require("../db/models/franchise");
const defineStaffsDetails = require("../db/models/staffs"); 
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

const isBlock =catchAsync(async(req,res,next)=>{
    const user = req.user
    const staff = defineStaffsDetails()
    const Data = await staff.findOne({ where: { email: user.email}}) || await Franchise.findOne({ where: { email:user.email}}) 
        const isBlock=Data.blocked
        if(isBlock==="blocked"){
            return next(new AppError("You are blocked by admin"))
        }
    next()
})

module.exports ={isBlock}