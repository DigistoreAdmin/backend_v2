'use strict';

const { services } = require('azure-storage');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('businessLoanExisting', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      uniqueId: {
        type: Sequelize.STRING
      },
      workId: {
        type: Sequelize.STRING,
      },
      customerName: {
        type: Sequelize.STRING
      },
      phoneNumber: {
        type: Sequelize.BIGINT
      },
      email: {
        type: Sequelize.STRING
      },
      cibil: {
        type: Sequelize.BOOLEAN
      },
      cibilScore: {
        type: Sequelize.INTEGER
      },
      cibilReport: {
        type: Sequelize.STRING
      },
      cibilAcknowledgement: {
        type: Sequelize.STRING
      },
      loanAmount: {
        type: Sequelize.BIGINT
      },
      sourceOfIncome: {
        type: Sequelize.STRING
      },
      titleDeed: {
        type: Sequelize.STRING
      },
      locationSketch: {
        type: Sequelize.STRING
      },
      encumbrance: {
        type: Sequelize.STRING
      },
      possession: {
        type: Sequelize.STRING
      },
      buildingTax: {
        type: Sequelize.STRING
      },
      landTax: {
        type: Sequelize.STRING
      },
      invoiceCopyOfAssetsToPurchase: {
        type: Sequelize.STRING
      },
      balanceSheetAndP1_2Years: {
        type: Sequelize.STRING
      },
      bankStatement_1Year: {
        type: Sequelize.STRING
      },
      rentAgreement: {
        type: Sequelize.STRING
      },
      licenceCopy: {
        type: Sequelize.STRING
      },
      otherDocuments: {
        type: Sequelize.STRING
      },
      gstDetails: {
        type: Sequelize.STRING
      },
      assignedId: {
        type: Sequelize.STRING
      },
      status: {
        type: Sequelize.ENUM("inQueue", "inProgress", "completed","rejected")
      },
      assignedOn: {
        type: Sequelize.DATE
      },
      completedOn: {
        type: Sequelize.DATE
      },
      loanStatus: {
        type: Sequelize.JSONB,
        defaultValue: {
          documentSubmittedToBank: false,
          bankVerified: false,
          bankApprovalOrReject: false,
          loanDispersed: false,
          commissionCredited: false
        },
      },
      rejectReason: {
        type: Sequelize.STRING
      },
      bankDetails: {
        type: Sequelize.STRING
      },
      loanGivenByBank: {
        type: Sequelize.BIGINT
      },
      doneBy: {
        type: Sequelize.STRING
      },
      serviceCharge: {
        type: Sequelize.INTEGER
      },
      commissionToFranchise: {
        type: Sequelize.INTEGER
      },
      commissionToHO: {
        type: Sequelize.INTEGER
      },
      otherPayments: {
        type: Sequelize.STRING
      },
      otherDocumentsByStaff: {
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
    await queryInterface.dropTable('businessLoanExisting');
  }
};