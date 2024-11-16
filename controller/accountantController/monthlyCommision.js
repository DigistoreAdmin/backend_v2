const { Sequelize } = require('sequelize');
const TransactionHistory = require("../../db/models/transationHistory");
const catchAsync = require('../../utils/catchAsync');

const getMonthlyCommissions = catchAsync(async (req, res) => {
    const { year, month } = req.body;

    if (!year || !month) {
        return res.status(400).json({ error: "Year and month are required." });
    }

    try {
        const results = await TransactionHistory.findAll({
            attributes: [
                [Sequelize.fn('COALESCE', Sequelize.fn('SUM', Sequelize.col('franchiseCommission')), 0), 'total_franchise_commission'],
                [Sequelize.fn('COALESCE', Sequelize.fn('SUM', Sequelize.col('adminCommission')), 0), 'total_admin_commission'],
            ],
            where: Sequelize.where(
                Sequelize.fn('DATE_TRUNC', 'month', Sequelize.col('createdAt')),
                '=',
                Sequelize.literal(`TO_DATE('${year}-${month}', 'YYYY-MM')`)
            ),
            raw: true,
        });

        return res.status(200).json(results[0] || {
            total_franchise_commission: "0.00",
            total_admin_commission: "0.00"
        });
    } catch (error) {
        console.error('Error fetching monthly commissions:', error);
        return res.status(500).json({ error: 'An error occurred while fetching data.' });
    }
});

module.exports = { getMonthlyCommissions };
