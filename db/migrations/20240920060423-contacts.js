'use strict';
/** @type {import('sequelize-cli').Migration}  */
module.exports = {
  async up(queryInterface, Sequelize){
    await queryInterface.createTable('contacts', {
      id: {
        allowNull:false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      fullName: {
        type:Sequelize.STRING,
      },
      email:  {
        type:Sequelize.STRING,
      },
      phoneNumber: {
        type: Sequelize.STRING,
      },
      subject: {
        type: Sequelize.STRING,
      },
      enquiryMessage: {
        type: Sequelize.TEXT,
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
    })
  },
  async down(queryInterface, Sequelize){
    await queryInterface.dropTable('contacts')
  }
}