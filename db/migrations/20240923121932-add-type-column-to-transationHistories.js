'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('transationHistories', 'typeOfTransation', {
      type: Sequelize.ENUM('debit', 'credit'),
      allowNull: true,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('transationHistories', 'typeOfTransation');
    await queryInterface.sequelize.query(
      `DROP TYPE IF EXISTS "enum_transationHistories_typeOfTransation";`
    );
  }
};
