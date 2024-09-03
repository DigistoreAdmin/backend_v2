'use strict';
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
      mobileNumber: {
        type: Sequelize.BIGINT
      },
      email: {
        type: Sequelize.STRING
      },
      cibil: {
        type: Sequelize.ENUM("approved","noCibil")
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
        type: Sequelize.ENUM("inQueue", "inProgress", "completed")
      },
      assignedOn: {
        type: Sequelize.DATE
      },
      completedOn: {
        type: Sequelize.DATE
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