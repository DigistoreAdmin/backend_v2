'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('fssaiLicences', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      uniqueId: {
        type: Sequelize.STRING
      },
      customerName: {
        type: Sequelize.STRING
      },
      mobileNumber: {
        type: Sequelize.BIGINT
      },
      email: {
        type: Sequelize.STRING
      },
      businessName: {
        type: Sequelize.STRING
      },
      businessAddressLine1: {
        type: Sequelize.STRING
      },
      businessAddressLine2: {
        type: Sequelize.STRING
      },
      pincode: {
        type: Sequelize.STRING
      },
      productsOrItems: {
        type: Sequelize.STRING
      },
      circleOfTheUnit: {
        type: Sequelize.STRING
      },
      aadhaarFront: {
        type: Sequelize.STRING
      },
      aadhaarBack: {
        type: Sequelize.STRING
      },
      panCard: {
        type: Sequelize.STRING
      },
      photo: {
        type: Sequelize.STRING
      },
      waterTestPaper: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      deletedAt: {
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('fssaiLicences');
  }
};