'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Step 1: Add new columns with the correct types
    await queryInterface.addColumn('moneyTransferDetails', 'fromUpiId_temp', {
      type: Sequelize.STRING
    });
    await queryInterface.addColumn('moneyTransferDetails', 'toUpiId_temp', {
      type: Sequelize.STRING
    });

    // Step 2: Copy data from the old columns to the new columns, converting as needed
    await queryInterface.sequelize.query(`
      UPDATE "moneyTransferDetails"
      SET 
        "fromUpiId_temp" = CAST("fromUpiId" AS VARCHAR),
        "toUpiId_temp" = CAST("toUpiId" AS VARCHAR)
    `);

    // Step 3: Drop the old columns
    await queryInterface.removeColumn('moneyTransferDetails', 'fromUpiId');
    await queryInterface.removeColumn('moneyTransferDetails', 'toUpiId');

    // Step 4: Rename the new columns to match the old column names
    await queryInterface.renameColumn('moneyTransferDetails', 'fromUpiId_temp', 'fromUpiId');
    await queryInterface.renameColumn('moneyTransferDetails', 'toUpiId_temp', 'toUpiId');
  },

  down: async (queryInterface, Sequelize) => {
    // Revert changes if needed

    // Step 1: Add new columns with the original types
    await queryInterface.addColumn('moneyTransferDetails', 'fromUpiId_temp', {
      type: Sequelize.BIGINT
    });
    await queryInterface.addColumn('moneyTransferDetails', 'toUpiId_temp', {
      type: Sequelize.BIGINT
    });

    // Step 2: Copy data from the string columns back to the bigint columns, converting as needed
    await queryInterface.sequelize.query(`
      UPDATE "moneyTransferDetails"
      SET 
        "fromUpiId_temp" = CAST("fromUpiId" AS BIGINT),
        "toUpiId_temp" = CAST("toUpiId" AS BIGINT)
    `);

    // Step 3: Drop the new string columns
    await queryInterface.removeColumn('moneyTransferDetails', 'fromUpiId');
    await queryInterface.removeColumn('moneyTransferDetails', 'toUpiId');

    // Step 4: Rename the temporary columns to match the original column names
    await queryInterface.renameColumn('moneyTransferDetails', 'fromUpiId_temp', 'fromUpiId');
    await queryInterface.renameColumn('moneyTransferDetails', 'toUpiId_temp', 'toUpiId');
  }
};
