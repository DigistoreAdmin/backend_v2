'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('franchises', 'userPlan', {
      type: Sequelize.ENUM('free', 'paid'),
      allowNull: false,
      defaultValue: 'free',
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('franchises', 'userPlan')
  }
};
