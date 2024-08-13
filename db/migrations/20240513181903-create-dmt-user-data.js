'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('dmtUserData', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      uniqueId: {
        type: Sequelize.INTEGER
      },
      customerId: {
        type: Sequelize.STRING
      },
      Name: {
        type: Sequelize.STRING
      },
      Address: {
        type: Sequelize.STRING
      },
      dateOfBirth: {
        type: Sequelize.STRING
      },
      Otp: {
        type: Sequelize.INTEGER
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
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('dmtUserData');
  }
};