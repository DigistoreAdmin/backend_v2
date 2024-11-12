"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("workTime", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      workId: {
        type: Sequelize.STRING,
      },
      employeeRecords: {
        type: Sequelize.ARRAY(Sequelize.JSON),
        defaultValue: [
          {
            staffName: {
              type: Sequelize.STRING,
            },
            assignedId: {
              type: Sequelize.STRING,
            },
            startTime: {
              type: Sequelize.STRING,
            },
            endTime: {
              type: Sequelize.STRING,
            },
            breakTimeStarted: {
              type: Sequelize.ARRAY(Sequelize.STRING)
            },
            breakTimeEnded: {
              type: Sequelize.ARRAY(Sequelize.DATE),
            },
            breakTime: {
              type: Sequelize.ARRAY(Sequelize.STRING),
            },
            totalBreakTime: {
              type: Sequelize.STRING,
            },
            totalTimeTaken: {
              type: Sequelize.STRING,
            },
            reassigned: {
              type: Sequelize.BOOLEAN,
            },
            reassignedTime: {
              type: Sequelize.STRING,
            },
          },
        ],
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
    await queryInterface.dropTable("workTime");
  },
};

// 'use strict';
// /** @type {import('sequelize-cli').Migration} */
// module.exports = {
//   async up(queryInterface, Sequelize) {
//     await queryInterface.createTable('workTime', {
//       id: {
//         allowNull: false,
//         autoIncrement: true,
//         primaryKey: true,
//         type: Sequelize.INTEGER
//       },
//       workId: {
//         type: Sequelize.STRING
//       },
//       staffName: {
//         type: Sequelize.ARRAY(Sequelize.STRING),
//       },
//       assignedId:{
//         type: Sequelize.ARRAY(Sequelize.STRING),
//       },
//       startTime: {
//         type: Sequelize.ARRAY(Sequelize.DATE),
//       },
//       endTime: {
//         type: Sequelize.ARRAY(Sequelize.DATE),
//       },
//       totalWorkTimeWithoutBreak: {
//         type: Sequelize.ARRAY(Sequelize.STRING),
//       },
//       breakTimeStarted: {
//         type: Sequelize.ARRAY(Sequelize.DATE),
//       },
//       breakTimeEnded: {
//         type: Sequelize.ARRAY(Sequelize.DATE),
//       },
//       totalBreakTime: {
//         type: Sequelize.ARRAY(Sequelize.STRING),
//       },
//       totalWorkTimeWithBreak:{
//         type: Sequelize.ARRAY(Sequelize.STRING),
//       },
//       reassigned: {
//         type: Sequelize.BOOLEAN,
//       },
//       reassignedTime: {
//         type: Sequelize.ARRAY(Sequelize.DATE),
//       },
//       createdAt: {
//         allowNull: false,
//         type: Sequelize.DATE
//       },
//       updatedAt: {
//         allowNull: false,
//         type: Sequelize.DATE
//       },
//       deletedAt: {
//         type: Sequelize.DATE,
//       }, 
//     });
//   },

//   async down(queryInterface, Sequelize) {
//     await queryInterface.dropTable('workTime');
//   }
// };