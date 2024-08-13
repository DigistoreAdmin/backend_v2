'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('operators', 'commissionType', {
      type: Sequelize.ENUM('percentage', 'flat'),
      allowNull: false,
      defaultValue: 'percentage'
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('operators', 'commissionType');
  }
};
