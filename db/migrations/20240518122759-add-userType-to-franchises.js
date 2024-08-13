"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Check if the column already exists before attempting to add it
    const tableDescription = await queryInterface.describeTable("franchises");
    if (!tableDescription.userType) {
      // Add the column only if it does not already exist
      await queryInterface.addColumn("franchises", "userType", {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: "franchise",
        validate: {
          notNull: { msg: "User type cannot be null" },
          notEmpty: { msg: "User type cannot be empty" },
        },
      });
    }
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("franchises", "userType");
  },
};