"use strict";

const { STRING } = require("sequelize");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("incomeTax", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      uniqueId: {
        type: Sequelize.STRING,
      },
      customerName: {
        type: Sequelize.STRING,
      },
      emailId: {
        type: Sequelize.STRING,
      },
      phoneNumber: {
        type: Sequelize.BIGINT,
      },
      panNumber: {
        type: Sequelize.STRING,
      },
      incomeTaxPassword: {
        type: Sequelize.STRING,
      },
      typeofTransaction: {
        type: Sequelize.ENUM("business", "salaried", "capitalGain", "other"),
      },
      gstUsername: {
        type: Sequelize.STRING,
      },
      gstPassword: {
        type: Sequelize.STRING,
      },
      bankStatement: {
        type: Sequelize.STRING,
      },
      businessLoanStatement: {
        type: Sequelize.STRING,
      },
      aadhaarFront: {
        type: Sequelize.STRING,
      },
      aadhaarBack: {
        type: Sequelize.STRING,
      },
      accountName: {
        type: Sequelize.STRING,
      },
      accountNumber: {
        type: Sequelize.STRING,
      },
      ifscCode: {
        type: Sequelize.STRING,
      },
      branchName: {
        type: Sequelize.STRING,
      },
      form16: {
        type: Sequelize.STRING,
      },
      pfAmount: {
        type: Sequelize.DECIMAL(10, 2),
      },
      healthInsuranceAmount: {
        type: Sequelize.DECIMAL(10, 2),
      },
      npsNumber: {
        type: Sequelize.DECIMAL(10, 2),
      },
      lifeInsuranceAmount: {
        type: Sequelize.DECIMAL(10, 2),
      },
      rentPaid: {
        type: Sequelize.DECIMAL(10, 2),
      },
      tuitionFees: {
        type: Sequelize.DECIMAL(10, 2),
      },
      housingLoanBankStatement: {
        type: Sequelize.STRING,
      },
      salarySlip: {
        type: Sequelize.STRING,
      },
      electricVehiclePurchase: {
        type: Sequelize.STRING,
      },
      typeofCapitalGain: {
        type: Sequelize.ENUM("property", "securities"),
      },
      saleDeed: {
        type: Sequelize.STRING,
      },
      purchaseDeed: {
        type: Sequelize.STRING,
      },
      securities: {
        type: Sequelize.ENUM("companyShares", "mutualFunds"),
      },
      saleDate: {
        type: Sequelize.DATE,
      },
      saleAmount: {
        type: Sequelize.DECIMAL(10, 2),
      },
      companyName: {
        type: Sequelize.STRING,
      },
      purchaseDate: {
        type: Sequelize.DATE,
      },
      purchaseAmount: {
        type: Sequelize.DECIMAL(10, 2),
      },
      isinNumber: {
        type: Sequelize.BIGINT,
      },
      otherDetails: {
        type: Sequelize.ARRAY(STRING),
      },
      status: {
        type: Sequelize.ENUM("inQueue", "inProgress", "completed","rejected"),
      },
      workId: {
        type: Sequelize.STRING,
      },
      computationFile: {
        type: Sequelize.STRING,
      },
      incomeTaxAcknowledgement: {
        type: Sequelize.STRING,
      },
      franchiseCommission: {
        type: Sequelize.DECIMAL,
      },
      HOCommission: {
        type: Sequelize.DECIMAL,
      },
      totalAmount: {
        type: Sequelize.DECIMAL,
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
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("incomeTax");
  },
};
