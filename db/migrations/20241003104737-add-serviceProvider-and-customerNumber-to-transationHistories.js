'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('transationHistories', 'serviceProvider', {
      type: Sequelize.STRING,
      allowNull: true,
      comment: 'Name of the service provider'
    });

    await queryInterface.addColumn('transationHistories', 'customerNumber', {
      type: Sequelize.BIGINT,
      allowNull: true,
      comment: 'Phone number or ID of the customer'
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('transationHistories', 'serviceProvider');
    await queryInterface.removeColumn('transationHistories', 'customerNumber');
  }
};
