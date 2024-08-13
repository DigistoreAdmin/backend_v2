'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('userPlans', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      planId:{
        type: Sequelize.STRING
      },
      planType: {
        type: Sequelize.ENUM('free', 'paid')
      },
      modeOfPayment: {
        type: Sequelize.ENUM('cash', 'online', 'cheque', 'upi')
      },
      amountCollected: {
        type: Sequelize.FLOAT
      },
      cgstPercent: {
        type: Sequelize.FLOAT
      },
      gstPercent: {
        type: Sequelize.FLOAT
      },
      totalGst: {
        type: Sequelize.FLOAT
      },
      discount: {
        type: Sequelize.FLOAT
      },
      balanceAmount: {
        type: Sequelize.FLOAT
      },
      collectedBy: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      deletedAt: {
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('userPlans');
  }
};