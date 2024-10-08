"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("microLoans", {
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
      address: {
        type: Sequelize.STRING,
      },
      pinCode: {
        type: Sequelize.BIGINT,
      },
      income: {
        type: Sequelize.BIGINT,
      },
      loanAmount: {
        type: Sequelize.BIGINT,
      },
      aadhaarFront: {
        type: Sequelize.STRING,
      },
      aadhaarBack: {
        type: Sequelize.STRING,
      },
      pan: {
        type: Sequelize.STRING,
      },
      bankStatement: {
        type: Sequelize.JSONB,
      },
      otherDocuments: {
        type: Sequelize.JSONB,
      },
      emiAmount: {
        type: Sequelize.BIGINT,
      },
      collectionPoint: {
        type: Sequelize.STRING,
      },
      collectionDate: {
        type: Sequelize.DATE,
      },
      collectionMethod: {
        type: Sequelize.STRING,
      },
      tenure: {
        type: Sequelize.BIGINT,
      },
      loanProcessedBy: {
        type: Sequelize.STRING,
      },
      commissionDetails: {
        type: Sequelize.BIGINT,
      },
      commissionCredit: {
        type: Sequelize.STRING,
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
      status: {
        type: Sequelize.ENUM("inQueue", "inProgress", "Completed"),
        defaultValue: "inQueue",
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      deletedAt: {
        type: Sequelize.DATE,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("microLoans");
  },
};
