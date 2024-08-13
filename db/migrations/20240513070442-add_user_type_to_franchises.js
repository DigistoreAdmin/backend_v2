"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Check if the column already exists before attempting to add it
    const tableDescription = await queryInterface.describeTable("franchises");
    if (!tableDescription.userType) {
      // Add the new column only if it does not already exist
      await queryInterface.addColumn("franchises", "userType", {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 2,
      });
    }
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("franchises", "userType");
  },
};