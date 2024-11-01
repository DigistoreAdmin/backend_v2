'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('workTime', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      workId: {
        type: Sequelize.STRING
      },
      startTime: {
        type: Sequelize.DATE
      },
      endTime: {
        type: Sequelize.DATE
      },
      totalWorkTimeWithoutBreak: {
        type: Sequelize.STRING
      },
      breakTimeStarted: {
        type: Sequelize.DATE
      },
      breakTimeEnded: {
        type: Sequelize.DATE
      },
      totalBreakTime: {
        type: Sequelize.STRING
      },
      totalWorkTimeWithBreak:{
        type: Sequelize.STRING,
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
    await queryInterface.dropTable('workTime');
  }
};