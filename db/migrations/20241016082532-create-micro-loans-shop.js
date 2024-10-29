"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("microLoansShop", {
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
      shopName: {
        type: Sequelize.STRING,
      },
      shopType: {
        type: Sequelize.STRING,
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
        type: Sequelize.STRING,
      },
      twoYearLicence: {
        type: Sequelize.JSONB,
      },
      shopPhoto: {
        type: Sequelize.STRING,
      },
      otherDocuments: {
        type: Sequelize.JSONB,
      }, //staff
      staffStatus: {
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
        type: Sequelize.STRING,
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
        type: Sequelize.ENUM("inQueue", "inProgress", "completed","rejected"),
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
    await queryInterface.dropTable("microLoansShop");
  },
};
