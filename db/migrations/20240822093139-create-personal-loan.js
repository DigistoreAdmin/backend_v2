'use strict';

const sequelize = require('../../config/database');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('personalLoan', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      uniqueId: {
        type: Sequelize.STRING
      },
      workId:{
        type: Sequelize.STRING
      },
      customerName: {
        type: Sequelize.STRING
      },
      mobileNumber: {
        type: Sequelize.BIGINT
      },
      email: {
        type: Sequelize.STRING
      },
      cibil:{
        type: Sequelize.ENUM("approved","noCibil")
      },
      cibilScore: {
        type: Sequelize.INTEGER
      },
      cibilReport: {
        type: Sequelize.STRING
      },
      cibilAcknowledgement:{
        type: Sequelize.STRING,
      },
      loanAmount: {
        type: Sequelize.BIGINT
      },
      sourceOfIncome: {
        type: Sequelize.STRING
      },
      salariedOrBusiness:{
        type: Sequelize.ENUM("salaried", "business"),
      },
      salarySlip: {
        type: Sequelize.STRING
      },
      bankStatement: {
        type: Sequelize.STRING
      },
      itr: {
        type: Sequelize.STRING
      },
      rentAgreement: {
        type: Sequelize.STRING
      },
      panchayathLicence: {
        type: Sequelize.STRING
      },
      cancelledCheque: {
        type: Sequelize.STRING
      },
      photo: {
        type: Sequelize.STRING
      },
      assignedId:{
        type: Sequelize.STRING
      },
      status:{
        type:Sequelize.ENUM("inQueue","inProgress","completed")
      },
      assignedOn:{
        type: Sequelize.DATE
      },
      completedOn:{
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
      rejectReason:{
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
        type: Sequelize.DATE,
        allowNull: true,
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('personalLoan');
  }
};