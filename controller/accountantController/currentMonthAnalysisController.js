const catchAsync = require("../../utils/catchAsync");
const AppError = require("../../utils/appError");
const TransactionHistory = require("../../db/models/transationhistory");
const { Op } = require("sequelize");

const currentMonthAnalysis = catchAsync(async (req, res, next) => {
  const startDate = new Date();
  startDate.setDate(1);
  startDate.setHours(0, 0, 0, 0);

  const endDate = new Date(startDate);
  endDate.setMonth(endDate.getMonth() + 1); 

  console.log("Start Date:", startDate);
  console.log("End Date:", endDate);

  const result = await TransactionHistory.findAll({
    attributes: [
      [
        TransactionHistory.sequelize.fn(
          "DATE_TRUNC",
          "month",
          TransactionHistory.sequelize.col("createdAt")
        ),
        "month",
      ],
      [
        TransactionHistory.sequelize.fn(
          "COUNT",
          TransactionHistory.sequelize.fn(
            "DISTINCT",
            TransactionHistory.sequelize.col("userName")
          )
        ),
        "active_franchises",
      ],
      [
        TransactionHistory.sequelize.fn("COUNT", TransactionHistory.sequelize.col("*")),
        "transaction_count",
      ],
      [
        TransactionHistory.sequelize.fn(
          "COUNT",
          TransactionHistory.sequelize.literal(
            "CASE WHEN status = 'success' THEN 1 END"
          )
        ),
        "successful_transactions",
      ],
      [
        TransactionHistory.sequelize.fn(
          "COUNT",
          TransactionHistory.sequelize.literal(
            "CASE WHEN status = 'fail' THEN 1 END"
          )
        ),
        "failed_transactions",
      ],
      [
        TransactionHistory.sequelize.literal(
          `ROUND(
            (COUNT(CASE WHEN status = 'success' THEN 1 END) * 100.0) 
            / NULLIF(COUNT(*), 0), 
          2)`
        ),
        "success_ratio",
      ],
      [
        TransactionHistory.sequelize.fn("SUM", TransactionHistory.sequelize.col("franchiseCommission")),
        "total_franchise_commission",
      ],
      [
        TransactionHistory.sequelize.fn("SUM", TransactionHistory.sequelize.col("adminCommission")),
        "total_admin_commission",
      ],
    ],
    where: {
      createdAt: {
        [Op.gte]: startDate,
        [Op.lt]: endDate,
      },
    },
    group: [
      TransactionHistory.sequelize.fn(
        "DATE_TRUNC",
        "month",
        TransactionHistory.sequelize.col("createdAt")
      ),
    ],
    order: [
      [
        TransactionHistory.sequelize.fn(
          "DATE_TRUNC",
          "month",
          TransactionHistory.sequelize.col("createdAt")
        ),
        "DESC",
      ],
    ],
    raw: true, 
  });

  console.log("Query Result:", result);

  if (!result || result.length === 0) {
    return next(new AppError("No data found for the current month.", 404));
  }

  res.status(200).json({
    status: "success",
    data: result,
  });
});

module.exports = { currentMonthAnalysis };
