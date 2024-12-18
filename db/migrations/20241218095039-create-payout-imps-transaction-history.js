'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('payoutImpsTransactionHistory', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      status: {
        type: Sequelize.ENUM("SUCCESS","ERROR")
      },
      message: {
        type: Sequelize.STRING
      },
      version: {
        type: Sequelize.STRING
      },
      time: {
        type: Sequelize.DATE
      },
      respCode: {
        type: Sequelize.STRING
      },
      beneficiaryAccountNumber: {
        type: Sequelize.STRING
      },
      beneficiaryName: {
        type: Sequelize.STRING
      },
      errorId: {
        type: Sequelize.STRING
      },
      errorMessage: {
        type: Sequelize.STRING
      },
      transcationType: {
        type: Sequelize.STRING
      },
      paymentReferenceNumber: {
        type: Sequelize.STRING
      },
      transactionReferenceNumber: {
        type: Sequelize.STRING
      },
      transactionDate: {
        type: Sequelize.STRING
      },
      amount1: {
        type: Sequelize.DECIMAL
      },
      status1: {
        type: Sequelize.STRING
      },
      transactionTime: {
        type: Sequelize.STRING
      },
      n10Time: {
        type: Sequelize.STRING
      },
      suspenseReason: {
        type: Sequelize.STRING
      },
      inOutTime: {
        type: Sequelize.STRING
      },
      camt59Time: {
        type: Sequelize.STRING
      },
      code: {
        type: Sequelize.STRING
      },
      transactionID: {
        type: Sequelize.STRING
      },
      reason: {
        type: Sequelize.STRING
      },
      service: {
        type: Sequelize.STRING
      },
      details: {
        type: Sequelize.STRING
      },
      balance: {
        type: Sequelize.DECIMAL
      },
      bankCharge: {
        type: Sequelize.DECIMAL
      },
      HOCommission: {
        type: Sequelize.DECIMAL
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
    await queryInterface.dropTable('payoutImpsTransactionHistory');
  }
};