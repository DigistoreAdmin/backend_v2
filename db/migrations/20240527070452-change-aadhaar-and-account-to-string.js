'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('franchises', 'aadhaarNumber', {
      type: Sequelize.STRING,
      allowNull: false,
    });
    await queryInterface.changeColumn('franchises', 'accountNumber', {
      type: Sequelize.STRING,
      allowNull: false,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('franchises', 'aadhaarNumber', {
      type: Sequelize.INTEGER,
      allowNull: false,
    });
    await queryInterface.changeColumn('franchises', 'accountNumber', {
      type: Sequelize.INTEGER,
      allowNull: false,
    });
  }
};
