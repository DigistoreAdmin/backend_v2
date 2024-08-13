'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Step 1: Add a new temporary column 'balance_temp' with the correct type and constraints
    await queryInterface.addColumn('wallets', 'balance_temp', {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: "0.00"
    });

    // Step 2: Copy and convert data from 'balance' to 'balance_temp'
    await queryInterface.sequelize.query(`
      UPDATE wallets
      SET balance_temp = CASE
          WHEN balance ~ '^\\d+(\\.\\d+)?$' THEN CAST(balance AS DECIMAL(10, 2))
          ELSE 0.00
        END
    `);

    // Step 3: Drop the original 'balance' column
    await queryInterface.removeColumn('wallets', 'balance');

    // Step 4: Rename the temporary column to 'balance'
    await queryInterface.renameColumn('wallets', 'balance_temp', 'balance');
  },

  down: async (queryInterface, Sequelize) => {
    // Step 1: Add the original 'balance' column back with its original type and constraints
    await queryInterface.addColumn('wallets', 'balance', {
      type: Sequelize.STRING,
      allowNull: true,
      defaultValue: "0"
    });

    // Step 2: Copy data back from 'balance' to 'balance'
    await queryInterface.sequelize.query(`
      UPDATE wallets
      SET balance = CAST(balance AS VARCHAR)
    `);

    // Step 3: Drop the 'balance_temp' column
    await queryInterface.removeColumn('wallets', 'balance_temp');
  }
};
