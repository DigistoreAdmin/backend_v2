const defineBusinessLoanUnsecuredNew = require("../../db/models/businessloanunsecurednew");
const definePersonalLoan = require("../../db/models/personalloan");
const AppError = require("../../utils/appError");
const catchAsync = require("../../utils/catchAsync");


const getPersonalLoanDetails = catchAsync(async (req,res)=>{
    try {
          const {page,pageLimit} = req.query

          if (!page || !pageLimit) {
            return res.status(400).json({ error: "page and pageSize are required" });
          }
        
          const pageNumber = parseInt(page, 10);
          const pageLimitNumber = parseInt(pageLimit, 10);
        
          const limit = pageLimitNumber;
          const offset = (pageNumber - 1) * limit;

        const personalLoan=definePersonalLoan() 

        const Data= await personalLoan.findAndCountAll({limit,offset})

        return res.json({
            status: "success",
            data: Data,
            totalItems: Data.count,
            totalPages: Math.ceil(Data.count / limit),
            currentPage: pageNumber,
          });

      } catch (error) {
        console.error("Error:", error);
        return next(new AppError(error.message, 500));
      }  
})


const getBusinessLoanUnsecuredNewDetails = catchAsync(async (req,res)=>{
    try {
          const {page,pageLimit} = req.query

          if (!page || !pageLimit) {
            return res.status(400).json({ error: "page and pageSize are required" });
          }
        
          const pageNumber = parseInt(page, 10);
          const pageLimitNumber = parseInt(pageLimit, 10);
        
          const limit = pageLimitNumber;
          const offset = (pageNumber - 1) * limit;

        const businessLoanUnsecuredNew=defineBusinessLoanUnsecuredNew() 

        const Data= await businessLoanUnsecuredNew.findAndCountAll({limit,offset})

        return res.json({
            status: "success",
            data: Data,
            totalItems: Data.count,
            totalPages: Math.ceil(Data.count / limit),
            currentPage: pageNumber,
          });

      } catch (error) {
        console.error("Error:", error);
        return next(new AppError(error.message, 500));
      }  
})

module.exports ={
    getPersonalLoanDetails,
    getBusinessLoanUnsecuredNewDetails
}