const catchAsync = require("../../utils/catchAsync");
const transactionHistory = require("../../db/models/transationhistory");
const sequelize = require("../../config/database");

const mostCommissionByFranchise = catchAsync(async (req, res, next) => {
    try {
        const { filter } = req.query;
        const where = { status: "success" };

        if (filter) {
            try {
                const filters = JSON.parse(filter);
                if (filters.serviceProvider) {
                    where.serviceProvider = filters.serviceProvider; 
                }
            } catch (parseError) {
                return res.status(400).json({ error: "Invalid filter format" });
            }
        }

        const transactionHistories = await transactionHistory.findAll({
            attributes: [
                "uniqueId",
                [sequelize.fn("COUNT", sequelize.col("uniqueId")), "count"]
            ],
            where,
            group: ["uniqueId"],
            order: [[sequelize.literal("count"), "DESC"]],
            limit: 5,
        });
        
        if (!transactionHistories.length) {
            return res.status(200).json({ message: "No transactions found for the selected filter" });
        }

        res.status(200).json({ 
            message: "Top franchises",
            data: transactionHistories
        });
    } catch (error) {
        console.error("Error in fetching most commission by franchise:", error.message);
        res.status(500).json({ error: "Error in franchise commission controller" });
    }
});

module.exports = { mostCommissionByFranchise };

