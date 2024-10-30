'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('financialStatements', {
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
      businessName: {
        type: Sequelize.STRING
      },
      businessType: {
        type: Sequelize.ENUM("proprietary","partnership","company")
      },
      phoneNumber: {
        type: Sequelize.BIGINT
      },
      email: {
        type: Sequelize.STRING
      },
      gstUsername: {
        type: Sequelize.STRING
      },
      gstPassword: {
        type: Sequelize.STRING
      },
      cashbookAndOtherAccounts: {
        type: Sequelize.STRING
      },
      creditorsAndDebitorsList: {
        type: Sequelize.STRING
      },
      bankStatements: {
        type: Sequelize.STRING
      },
      gstStatement: {
        type: Sequelize.STRING
      },
      stockDetails: {
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
    await queryInterface.dropTable('financialStatements');
  }
};