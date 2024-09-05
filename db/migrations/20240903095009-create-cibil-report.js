'use strict';
"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("cibilReport", {
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
      mobileNumber: {
        type: Sequelize.BIGINT,
      },
      emailId: {
        type: Sequelize.STRING,
      },
      purpose: {
        type: Sequelize.ENUM("applyForCivilReport", "alreadyHaveCibilReport"),
      },
      cibilScore: {
        type: Sequelize.BIGINT,
      },
      cibilReport: {
        type: Sequelize.STRING,
      },
      aadhaarFront: {
        type: Sequelize.STRING,
      },
      aadhaarBack: {
        type: Sequelize.STRING,
      },
      panCardFront: {
        type: Sequelize.STRING,
      },
      panCardBack: {
        type: Sequelize.STRING,
      },
      status: {
        type: Sequelize.ENUM("approve", "pending", "reject", "process"),
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
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      deletedAt: {
        allowNull: true,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("cibilReport");
  },
};
