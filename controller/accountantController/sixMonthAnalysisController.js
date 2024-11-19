const catchAsync = require("../../utils/catchAsync");
const AppError = require("../../utils/appError");
const TransactionHistory = require("../../db/models/transationhistory");
const { Op } = require("sequelize");

const sixMonthAnalysis = catchAsync(async (req, res, next) => {
  // Get the start date and end date for the 7 months range
  const startDate = new Date();
  startDate.setMonth(startDate.getMonth() - 7);

  console.log("Start Date:", startDate);
  console.log("Current Date:", new Date());

  const result = await TransactionHistory.findAll({
    attributes: [
      // Truncate the date to the month
      [
        TransactionHistory.sequelize.fn(
          "DATE_TRUNC",
          "month",
          TransactionHistory.sequelize.col("createdAt")
        ),
        "month",
      ],
      // Count distinct user names (active franchises)
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
      // Total transaction count
      [
        TransactionHistory.sequelize.fn(
          "COUNT",
          TransactionHistory.sequelize.col("*")
        ),
        "transaction_count",
      ],
      // Count of successful transactions
      [
        TransactionHistory.sequelize.fn(
          "COUNT",
          TransactionHistory.sequelize.literal(
            "CASE WHEN status = 'success' THEN 1 END"
          )
        ),
        "successful_transactions",
      ],
      // Count of failed transactions
      [
        TransactionHistory.sequelize.fn(
          "COUNT",
          TransactionHistory.sequelize.literal(
            "CASE WHEN status = 'fail' THEN 1 END"
          )
        ),
        "failed_transactions",
      ],
      // Success ratio
      [
        TransactionHistory.sequelize.fn(
          "ROUND",
          TransactionHistory.sequelize.literal(
            `(COUNT(CASE WHEN "status" = 'success' THEN 1 END) * 100.0) / NULLIF(COUNT(*), 0)`
          ),
          2
        ),
        "success_ratio",
      ],
      // Total franchise commission
      [
        TransactionHistory.sequelize.fn(
          "ROUND",
          TransactionHistory.sequelize.fn(
            "SUM",
            TransactionHistory.sequelize.col("franchiseCommission")
          ),
          2
        ),
        "total_franchise_commission",
      ],
      // Total admin commission
      [
        TransactionHistory.sequelize.fn(
          "ROUND",
          TransactionHistory.sequelize.fn(
            "SUM",
            TransactionHistory.sequelize.col("adminCommission")
          ),
          2
        ),
        "total_admin_commission",
      ],
    ],
    where: {
      // Filter transactions in the past 7 months
      createdAt: {
        [Op.gte]: startDate,
        [Op.lt]: new Date(), // Up to the current date
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
  });

  // Log result to debug
  console.log("Query Result:", result);

  if (!result || result.length === 0) {
    return next(new AppError("No data found for the past 7 months.", 404));
  }

  res.status(200).json({
    status: "success",
    data: result,
  });
});

module.exports = { sixMonthAnalysis };

