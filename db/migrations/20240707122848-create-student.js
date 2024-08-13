"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("students", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      collegeName: {
        type: Sequelize.STRING,
      },
      collegeId: {
        type: Sequelize.STRING,
      },
      email: {
        type: Sequelize.STRING,
      },
      district: {
        type: Sequelize.STRING,
      },
      teamId: {
        type: Sequelize.STRING,
      },
      facultyName: {
        type: Sequelize.STRING,
      },
      captainName: {
        type: Sequelize.STRING,
      },
      mobileNumber: {
        type: Sequelize.BIGINT,
      },
      password: {
        type: Sequelize.STRING,
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
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("students");
  },
};
