"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("partnershipDeedPreparation", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      uniqueId: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      customerName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      phoneNumber: {
        type: Sequelize.BIGINT,
        allowNull: false,
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      businessName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      businessAddress: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      numberOfPartners: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      partners: {
        type: Sequelize.JSON,
        allowNull: false,
      },
      bankAmountStatement: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      rentOrLeaseAgreement: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      latestPropertyTax: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      LandTaxRecipt: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      assignedId: {
        type: Sequelize.STRING,
      },
      status: {
        type: Sequelize.ENUM("inQueue", "inProgress", "completed", "rejected"),
        defaultValue: "inQueue",
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
        type: Sequelize.DATE,
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("partnershipDeedPreparation");
  },
};
