'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('transationHistories', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      transactionId: {
        type: Sequelize.STRING
      },
      userName: {
        type: Sequelize.STRING
      },
      userType: {
        type: Sequelize.STRING
      },
      service: {
        type: Sequelize.STRING
      },
      status: {
        type: Sequelize.ENUM("pending", "fail","success")
      },
      amount: {
        type: Sequelize.DECIMAL
      },
      franchiseCommission: {
        type: Sequelize.DECIMAL,
        allowNull: true,
        defaultValue:0.00
      },
      adminCommission: {
        type: Sequelize.DECIMAL,
        allowNull: true,
        defaultValue:0.00
      },
      walletBalance: {
        type: Sequelize.DECIMAL
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
        type: Sequelize.DATE
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('transationHistories');
  }
};