'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
   await queryInterface.addColumn('staffs','blocked',{
    type: Sequelize.ENUM("blocked","unBlocked"),
    allowNull: false,
    defaultValue:"unBlocked"
  })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('staffs','blocked')
  }
};
