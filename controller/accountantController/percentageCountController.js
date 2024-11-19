const { Op, Sequelize } = require('sequelize');
const transactionHistory = require('../../db/models/transationhistory');

const percentageCountOfServices = async (req, res) => {
    try {
        const servicesData = await transactionHistory.findAll({
            attributes: [
                'service', 
                [Sequelize.fn('COUNT', Sequelize.col('service')), 'service_count']
            ],
            group: ['service'],
            order: [
                [Sequelize.col('service_count'), 'DESC']
            ]
        });

        const totalCount = await transactionHistory.count();

        const servicesWithPercentage = servicesData.map(service => {
            const percentage = totalCount > 0 ? (service.dataValues.service_count * 100.0) / totalCount : 0;
            return { ...service.dataValues, percentage: parseFloat(percentage.toFixed(2)) };
        });

        // Send the response with the calculated data
        res.status(200).json({ data: servicesWithPercentage });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Error in percentage count controller" });
    }
};

module.exports = { percentageCountOfServices };
