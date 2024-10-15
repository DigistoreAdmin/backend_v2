"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("loanAgainstProperties", {
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
        allowNull: false,
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
      salarySlip: {
        type: Sequelize.STRING,
      },
      isSalariedOrBusiness: {
        type: Sequelize.ENUM("salaried", "business"),
      },
      coApplicantSalarySlip: {
        type: Sequelize.STRING,
      },
      bankStatement: {
        type: Sequelize.STRING,
      },
      coApplicantBankStatement: {
        type: Sequelize.STRING,
      },
      cancelledCheque: {
        type: Sequelize.STRING,
      },
      coApplicantCancelledCheque: {
        type: Sequelize.STRING,
      },
      photo: {
        type: Sequelize.STRING,
      },
      coApplicantPhoto: {
        type: Sequelize.STRING,
      },
      itr: {
        type: Sequelize.STRING,
      },
      coApplicantItr: {
        type: Sequelize.STRING,
      },
      rentAgreement: {
        type: Sequelize.STRING,
      },
      coApplicantRentAgreement: {
        type: Sequelize.STRING,
      },
      municipalLicence: {
        type: Sequelize.STRING,
      },
      coApplicantMunicipalLicence: {
        type: Sequelize.STRING,
      },
      titleDeed: {
        type: Sequelize.STRING,
      },
      locationSketch: {
        type: Sequelize.STRING,
      },
      encumbrance: {
        type: Sequelize.STRING,
      },
      possession: {
        type: Sequelize.STRING,
      },
      buildingTax: {
        type: Sequelize.STRING,
      },
      landTax: {
        type: Sequelize.STRING,
      },
      cibil: {
        type: Sequelize.ENUM("approved", "noCibil"),
      },
      cibilAcknowledgement: {
        type: Sequelize.STRING,
      },
      cibilReport: {
        type: Sequelize.STRING,
      },
      cibilScore: {
        type: Sequelize.BIGINT,
      },
      loanAmount: {
        type: Sequelize.BIGINT,
      },
      sourceOfIncome: {
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
        type: Sequelize.ENUM("inQueue", "inProgress", "completed"),
      },
      assignedId: {
        type: Sequelize.STRING,
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
    await queryInterface.dropTable("loanAgainstProperties");
  },
};