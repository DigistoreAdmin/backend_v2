'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('companyFormations', {
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
      phoneNumber: {
        type: Sequelize.BIGINT
      },
      email: {
        type: Sequelize.STRING
      },
      businessType: {
        type: Sequelize.ENUM("proprietary","partnership","company")
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
      numberOfDirectors: {
        type: Sequelize.INTEGER
      },
      directorDetails: {
        type: Sequelize.JSONB
      },
      addressProof: {
        type: Sequelize.STRING
      },
      bankStatement: {
        type: Sequelize.STRING
      },
      NOC: {
        type: Sequelize.STRING
      },
      educationDetails: {
        type: Sequelize.STRING
      },
      rentAgreement: {
        type: Sequelize.STRING
      },
      shareHoldingDetails: {
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
    await queryInterface.dropTable('companyFormations');
  }
};