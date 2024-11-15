"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("usedvehicleLoan", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      uniqueId: {
        type: Sequelize.STRING,
      },
      workId: {
        type: Sequelize.STRING,
      },
      customerName: {
        type: Sequelize.STRING,
      },
      phoneNumber: {
        type: Sequelize.BIGINT,
      },
      email: {
        type: Sequelize.STRING,
      },
      typeofLoan: {
        type: Sequelize.ENUM("business", "salaried"),
      },
      salarySlip: {
        type: Sequelize.STRING,
      },
      bankStatement: {
        type: Sequelize.STRING,
      },
      cancelledCheque: {
        type: Sequelize.STRING,
      },
      photo: {
        type: Sequelize.STRING,
      },
      ITR: {
        type: Sequelize.STRING,
      },
      rentAgreement: {
        type: Sequelize.STRING,
      },
      panchayathOrMuncipleLicence: {
        type: Sequelize.STRING,
      },
      invoiceFromDealer: {
        type: Sequelize.STRING,
      },
      RC_Copy: {
        type: Sequelize.STRING,
      },
      insuranceCopy: {
        type: Sequelize.STRING,
      },
      cibil: {
        type: Sequelize.ENUM("approved", "noCibil"),
      },
      cibilScore: {
        type: Sequelize.BIGINT,
      },
      cibilReport: {
        type: Sequelize.STRING,
      },
      acknowledgment: {
        type: Sequelize.STRING,
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
      status: {
        type: Sequelize.ENUM("inQueue", "inProgress", "completed","rejected"),
        defaultValue: "inQueue",
      },
      assignedId: {
        type: Sequelize.INTEGER,
      },
      assignedOn: {
        type: Sequelize.DATE,
      },
      completedOn: {
        type: Sequelize.DATE,
      },
      createdAt: {
        type: Sequelize.DATE,
      },
      updatedAt: {
        type: Sequelize.DATE,
      },
      deletedAt: {
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("usedvehicleLoan");
  },
};
