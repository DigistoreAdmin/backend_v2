'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('moneyTransferDetails', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      uniqueId: {
        type: Sequelize.STRING
      },
      transationId: {
        type: Sequelize.STRING
      },
      fromAcc: {
        type: Sequelize.STRING
      },
      toAcc: {
        type: Sequelize.STRING
      },
      fromUpiId: {
        type: Sequelize.STRING
      },
      toUpiId: {
        type: Sequelize.STRING
      },
      executiveName: {
        type: Sequelize.STRING
      },
      executiveId: {
        type: Sequelize.STRING
      },
      referenceNo: {
        type: Sequelize.STRING
      },
      amount: {
        type: Sequelize.STRING
      },
      status: {
        type: Sequelize.ENUM('pending', 'rejected', 'approved')
      },
      date: {
        type: Sequelize.STRING
      },
      remark: {
        type: Sequelize.STRING
      },
      transactionType: {
        type: Sequelize.ENUM('bankig', 'internetBanking', 'executive','upi')
      },
      documentPic: {
        type: Sequelize.STRING
      },
      deletedAt: {
        type: Sequelize.DATE
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('moneyTransferDetails');
  }
};