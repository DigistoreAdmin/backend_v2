'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('operators', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      serviceProvider: {
        type: Sequelize.STRING
      },
      SP_key: {
        type: Sequelize.STRING
      },
      commission: {
        type: Sequelize.DECIMAL
      },
      commissionType: {
        type: Sequelize.ENUM("percentage", "flat")
      },
      rechargeType: {
        type: Sequelize.ENUM("Prepaid", "Postpaid","Dth","Electricity","Water","Fastag","Landline")
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
    await queryInterface.dropTable('operators');
  }
};
