migration

'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('rechapiOperators', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      commissionType: {
        type: Sequelize.ENUM("percentage", "flat")
      },
      serviceProvider: {
        type: Sequelize.STRING
      },
      operatorId: {
        type: Sequelize.STRING
      },
      commission: {
        type: Sequelize.STRING
      },
      gstMode:{
        type:Sequelize.STRING,
        allowNull: false,
      },
      rechargeType: {
        type: Sequelize.ENUM("prepaid", "postpaid","Dth","Electricity","Water","Fastag","Landline")
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('rechapiOperators');
  }
}