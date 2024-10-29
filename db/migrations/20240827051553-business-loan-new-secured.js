"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("BusinessLoanNewSecured", {
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
      invoiceCopyOfAssetsToPurchase: {
        type: Sequelize.STRING,
      },
      rentAgreement: {
        type: Sequelize.STRING,
      },
      licenceCopy: {
        type: Sequelize.STRING,
      },
      otherDocuments:{
        type:Sequelize.ARRAY(Sequelize.STRING)
      },
      cibil: {
        type: Sequelize.BOOLEAN,
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
      status: {
        type: Sequelize.ENUM("inQueue", "inProgress", "completed","rejected"),
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
    await queryInterface.dropTable("BusinessLoanNewSecured");
  },
};
