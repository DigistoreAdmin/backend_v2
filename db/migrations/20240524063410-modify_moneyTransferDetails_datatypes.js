'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Step 1: Add new columns with the correct types
    await queryInterface.addColumn('moneyTransferDetails', 'fromAcc_temp', {
      type: Sequelize.BIGINT
    });
    await queryInterface.addColumn('moneyTransferDetails', 'toAcc_temp', {
      type: Sequelize.BIGINT
    });
    await queryInterface.addColumn('moneyTransferDetails', 'fromUpiId_temp', {
      type: Sequelize.BIGINT
    });
    await queryInterface.addColumn('moneyTransferDetails', 'toUpiId_temp', {
      type: Sequelize.BIGINT
    });
    await queryInterface.addColumn('moneyTransferDetails', 'executiveId_temp', {
      type: Sequelize.BIGINT
    });
    await queryInterface.addColumn('moneyTransferDetails', 'referenceNo_temp', {
      type: Sequelize.BIGINT
    });
    await queryInterface.addColumn('moneyTransferDetails', 'amount_temp', {
      type: Sequelize.DECIMAL(10, 2)
    });
    await queryInterface.addColumn('moneyTransferDetails', 'date_temp', {
      type: Sequelize.DATE
    });

    // Step 2: Copy data from the old columns to the new columns, converting as needed
    await queryInterface.sequelize.query(`
      UPDATE "moneyTransferDetails"
      SET 
        "fromAcc_temp" = CAST("fromAcc" AS BIGINT),
        "toAcc_temp" = CAST("toAcc" AS BIGINT),
        "fromUpiId_temp" = CAST("fromUpiId" AS BIGINT),
        "toUpiId_temp" = CAST("toUpiId" AS BIGINT),
        "executiveId_temp" = CAST("executiveId" AS BIGINT),
        "referenceNo_temp" = CAST("referenceNo" AS BIGINT),
        "amount_temp" = CAST("amount" AS BIGINT),
        "date_temp" = "date"::DATE
    `);

    // Step 3: Drop the old columns
    await queryInterface.removeColumn('moneyTransferDetails', 'fromAcc');
    await queryInterface.removeColumn('moneyTransferDetails', 'toAcc');
    await queryInterface.removeColumn('moneyTransferDetails', 'fromUpiId');
    await queryInterface.removeColumn('moneyTransferDetails', 'toUpiId');
    await queryInterface.removeColumn('moneyTransferDetails', 'executiveId');
    await queryInterface.removeColumn('moneyTransferDetails', 'referenceNo');
    await queryInterface.removeColumn('moneyTransferDetails', 'amount');
    await queryInterface.removeColumn('moneyTransferDetails', 'date');

    // Step 4: Rename the new columns to match the old column names
    await queryInterface.renameColumn('moneyTransferDetails', 'fromAcc_temp', 'fromAcc');
    await queryInterface.renameColumn('moneyTransferDetails', 'toAcc_temp', 'toAcc');
    await queryInterface.renameColumn('moneyTransferDetails', 'fromUpiId_temp', 'fromUpiId');
    await queryInterface.renameColumn('moneyTransferDetails', 'toUpiId_temp', 'toUpiId');
    await queryInterface.renameColumn('moneyTransferDetails', 'executiveId_temp', 'executiveId');
    await queryInterface.renameColumn('moneyTransferDetails', 'referenceNo_temp', 'referenceNo');
    await queryInterface.renameColumn('moneyTransferDetails', 'amount_temp', 'amount');
    await queryInterface.renameColumn('moneyTransferDetails', 'date_temp', 'date');
  },

  down: async (queryInterface, Sequelize) => {
    // Revert changes if needed
  }
};
