'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('transationHistories', 'commissionType', {
      type: Sequelize.ENUM('wallet', 'cash'),
      allowNull: true,
      defaultValue: 'wallet',
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('transationHistories', 'commissionType');
    await queryInterface.sequelize.query(
      `DROP TYPE IF EXISTS "enum_transationHistories_commissionType";`
    );
  }
};
