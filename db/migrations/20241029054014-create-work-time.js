'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('workTimes', {
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
      timeTaken: {
        type: Sequelize.DATE
      },
      breakStarted: {
        type: Sequelize.DATE
      },
      breakEnded: {
        type: Sequelize.DATE
      },
      totalBreakTime: {
        type: Sequelize.DATE
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
    await queryInterface.dropTable('workTimes');
  }
};