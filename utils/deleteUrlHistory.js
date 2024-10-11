const ApiLog = require("../db/models/urlHistory");
const { Op } = require("sequelize");

const deleteUrlHistory = async () => {
  try {
    const cutoffDate = new Date(Date.now() - 1.5 * 30 * 24 * 60 * 60 * 1000);

    const deletedRecords = await ApiLog.destroy({
      where: {
        createdAt: {
          [Op.lt]: cutoffDate,
        },
      },
    });

    console.log(`Deleted ${deletedRecords} old API logs.`);
  } catch (error) {
    console.error("Error deleting old API logs:", error);
  }
};

module.exports = deleteUrlHistory;
