'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('trainBooking', {
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
      boardingStation: {
        type: Sequelize.STRING
      },
      destinationStation: {
        type: Sequelize.STRING
      },
      trainNumber: {
        type: Sequelize.INTEGER
      },
      startDate: {
        type: Sequelize.DATE
      },
      preference: {
        type: Sequelize.STRING
      },
      passengerDetails: {
        type: Sequelize.JSONB
      },
      status: {
        type: Sequelize.ENUM("inQueue","inProgress","completed","rejected")
      },
      assignedId: {
        type: Sequelize.STRING
      },
      assignedOn: {
        type: Sequelize.DATE
      },
      completedOn: {
        type: Sequelize.DATE
      },
      amount:{
        type:Sequelize.INTEGER,
      },
      workId:{
        type:Sequelize.STRING,
      },
      ticket:{
        type:Sequelize.STRING,
      },
      serviceCharge:{
        type:Sequelize.INTEGER,
      },
      commissionToFranchise:{
        type:Sequelize.INTEGER,
      },
      commissionToHeadOffice:{
        type:Sequelize.INTEGER,
      },
      totalAmount:{
        type:Sequelize.INTEGER,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      deletedAt:{
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('trainBooking');
  }
};