'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('udyamRegistrations', {
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
      addressLine1: {
        type: Sequelize.STRING
      },
      addressLine2: {
        type: Sequelize.STRING
      },
      pinCode: {
        type: Sequelize.INTEGER
      },
      shopLongitude: {
        type: Sequelize.STRING
      },
      shopLatitude: {
        type: Sequelize.STRING
      },
      religionWithCaste: {
        type: Sequelize.STRING
      },
      totalNumberOfEmployees: {
        type: Sequelize.INTEGER
      },
      totalMen: {
        type: Sequelize.INTEGER
      },
      totalWomen: {
        type: Sequelize.STRING
      },
      firmRegistrationDate: {
        type: Sequelize.STRING
      },
      firmCommencementDate: {
        type: Sequelize.STRING
      },
      businessType: {
        type: Sequelize.ENUM("proprietary","partnership","company")
      },
      annualTurnOver: {
        type: Sequelize.INTEGER
      },
      aadhaarFront: {
        type: Sequelize.STRING
      },
      aadhaarBack: {
        type: Sequelize.STRING
      },
      pancard: {
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
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('udyamRegistrations');
  }
};