"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("vehicleLoan_New", {
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
      mobileNumber: {
        type: Sequelize.BIGINT,
      },
      emailId: {
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
      status: {
        type: Sequelize.ENUM("inQueue", "inProgress", "Completed"),
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
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      deletedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("vehicleLoan_New");
  },
};
