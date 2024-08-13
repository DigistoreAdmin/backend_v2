'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Modify the data type of the 'amount' column to DECIMAL with precision 10 and scale 2
    await queryInterface.changeColumn('transationHistories', 'amount', {
      type: Sequelize.DECIMAL(10, 2) // DECIMAL data type with precision 10 and scale 2
    });

    // Modify the data type of the 'franchiseCommission' column to DECIMAL with precision 10 and scale 2
    await queryInterface.changeColumn('transationHistories', 'franchiseCommission', {
      type: Sequelize.DECIMAL(10, 2) // DECIMAL data type with precision 10 and scale 2
    });

    // Modify the data type of the 'adminCommission' column to DECIMAL with precision 10 and scale 2
    await queryInterface.changeColumn('transationHistories', 'adminCommission', {
      type: Sequelize.DECIMAL(10, 2) // DECIMAL data type with precision 10 and scale 2
    });

    // Modify the data type of the 'walletBalance' column to DECIMAL with precision 10 and scale 2
    await queryInterface.changeColumn('transationHistories', 'walletBalance', {
      type: Sequelize.DECIMAL(10, 2) // DECIMAL data type with precision 10 and scale 2
    });
  },

  down: async (queryInterface, Sequelize) => {
    // This is the "down" migration to revert the changes if needed.
    // It would revert the data type changes for the columns.

    // Revert the data type change for the 'amount' column
    await queryInterface.changeColumn('transationHistories', 'amount', {
      type: Sequelize.DECIMAL // Revert to the default DECIMAL data type without precision and scale
    });

    // Revert the data type change for the 'franchiseCommission' column
    await queryInterface.changeColumn('transationHistories', 'franchiseCommission', {
      type: Sequelize.DECIMAL // Revert to the default DECIMAL data type without precision and scale
    });

    // Revert the data type change for the 'adminCommission' column
    await queryInterface.changeColumn('transationHistories', 'adminCommission', {
      type: Sequelize.DECIMAL // Revert to the default DECIMAL data type without precision and scale
    });

    // Revert the data type change for the 'walletBalance' column
    await queryInterface.changeColumn('transationHistories', 'walletBalance', {
      type: Sequelize.DECIMAL // Revert to the default DECIMAL data type without precision and scale
    });
  }
};
