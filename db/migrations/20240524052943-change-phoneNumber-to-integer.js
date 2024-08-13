'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Step 1: Add a new column with the correct type allowing nulls temporarily
    await queryInterface.addColumn('user', 'newPhoneNumber', {
      type: Sequelize.BIGINT,
      allowNull: true,
    });

    // Step 2: Copy data from the old column to the new column, converting as needed
    await queryInterface.sequelize.query(`
      UPDATE "user"
      SET "newPhoneNumber" = CAST("phoneNumber" AS BIGINT)
    `);

    // Step 3: Drop the old column
    await queryInterface.removeColumn('user', 'phoneNumber');

    // Step 4: Rename the new column to match the old column name
    await queryInterface.renameColumn('user', 'newPhoneNumber', 'phoneNumber');

    // Step 5: Alter the new column to disallow nulls
    await queryInterface.changeColumn('user', 'phoneNumber', {
      type: Sequelize.BIGINT,
      allowNull: false,
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Revert changes if needed (similar steps, creating old columns again and copying data back)
    await queryInterface.addColumn('user', 'oldPhoneNumber', {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.sequelize.query(`
      UPDATE "user"
      SET "oldPhoneNumber" = CAST("phoneNumber" AS VARCHAR)
    `);

    await queryInterface.removeColumn('user', 'phoneNumber');

    await queryInterface.renameColumn('user', 'oldPhoneNumber', 'phoneNumber');
  }
};
