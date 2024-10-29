'use strict';

const { DataTypes, STRING } = require('sequelize');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('businessLoanUnsecuredNew', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      uniqueId: {
        type: Sequelize.STRING
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
      workId: {
        type: Sequelize.STRING
      },
      cibil: {
        type: Sequelize.ENUM("approved","noCibil")
      },
      cibilScore: {
        type: Sequelize.STRING
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
      invoiceCopyOfAssetsToPurchase: {
        type: Sequelize.STRING
      },
      rentAgreement: {
        type: Sequelize.STRING
      },
      licenceCopy: {
        type: Sequelize.STRING
      },
      otherDocuments: {
        type: Sequelize.ARRAY(STRING)
      },
      assignedId:{
        type: Sequelize.STRING
      },
      status:{
        type: Sequelize.ENUM("inQueue","inProgress","completed","rejected")
      },
      assignedOn:{
        type: Sequelize.DATE
      },
      completedOn:{
        type: Sequelize.DATE
      },
      loanStatus:{
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
      deletedAt:{
        type:Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('businessLoanUnsecuredNew');
  }
};