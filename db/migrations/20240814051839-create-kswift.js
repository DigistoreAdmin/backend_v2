"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("kswift", {
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
      businessName: {
        type: Sequelize.STRING,
      },
      businessAddressLine1: {
        type: Sequelize.STRING,
      },
      businessAddressLine2: {
        type: Sequelize.STRING,
      },
      pinCode: {
        type: Sequelize.INTEGER,
      },
      businessType: {
        type: Sequelize.STRING,
      },
      aadhaarFront: {
        type: Sequelize.STRING,
      },
      aadhaarBack: {
        type: Sequelize.STRING,
      },
      signature: {
        type: Sequelize.STRING,
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
    await queryInterface.dropTable("kswift");
  },
};
