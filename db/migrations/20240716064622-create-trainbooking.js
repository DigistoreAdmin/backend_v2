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
      bookingType:{
        type: Sequelize.ENUM("1","2")
      },
      returnDate:{
        type: Sequelize.DATE,
      },
      ticketType:{
        type: Sequelize.ENUM("General","Ladies","Lower berth","Person with disability","Duty pass","Tatkal","Premium tatkal"),
      },
      coachType:{
        type: Sequelize.ENUM("Anubhuti Class(EA)","AC First Class(1A)","Vistadome AC(EV)","Exec. Chair Car(EC)","AC 2 Tier(2A)","First Class(FC)","AC 3 Tier(3A)","AC 3 Economy(3E)","Vistadome Chair Car(VC)","AC Chair Car(CC)","Sleeper(SL)","Vistadome Non AC(VS)","Second Sitting(2S)",),
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
      commissionToHO:{
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