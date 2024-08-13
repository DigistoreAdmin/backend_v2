'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('userPlans', 'amountCollected', {
      type: Sequelize.INTEGER
    });

    await queryInterface.changeColumn('userPlans', 'discount', {
      type: Sequelize.INTEGER
    });

    await queryInterface.changeColumn('userPlans', 'cgstPercent', {
      type: Sequelize.DECIMAL(10, 2)
    });

    await queryInterface.changeColumn('userPlans', 'gstPercent', {
      type: Sequelize.DECIMAL(10, 2)
    });

    await queryInterface.changeColumn('userPlans', 'totalGst', {
      type: Sequelize.DECIMAL(10, 2)
    });

    await queryInterface.changeColumn('userPlans', 'balanceAmount', {
      type: Sequelize.DECIMAL(10, 2)
    });
  },

  down: async (queryInterface, Sequelize) => {
    // This is the "down" migration to revert the changes if needed.
    // It would revert the data type changes for the columns.
    await queryInterface.changeColumn('userPlans', 'amountCollected', {
      type: Sequelize.FLOAT
    });

    await queryInterface.changeColumn('userPlans', 'discount', {
      type: Sequelize.FLOAT
    });

    await queryInterface.changeColumn('userPlans', 'cgstPercent', {
      type: Sequelize.FLOAT
    });

    await queryInterface.changeColumn('userPlans', 'gstPercent', {
      type: Sequelize.FLOAT
    });

    await queryInterface.changeColumn('userPlans', 'totalGst', {
      type: Sequelize.FLOAT
    });

    await queryInterface.changeColumn('userPlans', 'balanceAmount', {
      type: Sequelize.FLOAT
    });
  }
};
