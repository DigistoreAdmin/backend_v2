"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("medicalInsurance", {
      id: {
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
      emailId: {
        type: Sequelize.STRING,
      },
      individualOrFamily: {
        type: Sequelize.ENUM("individual", "family"),
      },
      dob: {
        type: Sequelize.DATE,
      },
      sumInsuredLookingFor: {
        type: Sequelize.INTEGER,
      },
      preferredHospital: {
        type: Sequelize.STRING,
      },
      otherAddOn: {
        type: Sequelize.JSONB,
      },
      anyExistingDisease: {
        type: Sequelize.STRING,
      },
      numberOfAdult: {
        type: Sequelize.INTEGER,
      },
      numberOfKids: {
        type: Sequelize.INTEGER,
      },
      familyDetails: {
        type: Sequelize.JSONB,
      },
      aadharFront: {
        type: Sequelize.STRING,
      },
      aadharBack: {
        type: Sequelize.STRING,
      },
      pan: {
        type: Sequelize.STRING,
      },
      bank: {
        type: Sequelize.STRING,
      },
      height: {
        type: Sequelize.FLOAT,
      },
      weight: {
        type: Sequelize.FLOAT,
      },
      assignedId: {
        type: Sequelize.STRING,
      },
      status: {
        type: Sequelize.ENUM("inQueue", "inProgress", "completed"),
        defaultValue: "inQueue",
      },
      assignedOn: {
        type: Sequelize.DATE,
      },
      completedOn: {
        type: Sequelize.DATE,
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
    await queryInterface.dropTable("medicalInsurance");
  },
};
