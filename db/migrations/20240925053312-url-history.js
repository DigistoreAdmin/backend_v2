"use strict";
/** @type {import('sequelize-cli').Migration}  */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("urlHistory", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      route: {
        type: Sequelize.TEXT,
      },
      response: {
        type: Sequelize.JSONB,
      },
      statusCode: {
        type: Sequelize.INTEGER,
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
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("urlHistory");
  },
};
