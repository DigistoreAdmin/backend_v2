"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("students", "onBoardedBy", {
      type: Sequelize.STRING,
      allowNull: false,
    });
    await queryInterface.addColumn("students", "onBoardedPersonId", {
      type: Sequelize.STRING,
      allowNull: false,
    });
    await queryInterface.addColumn("students", "onBoardedPersonName", {
      type: Sequelize.STRING,
      allowNull: false,
    });
    await queryInterface.addColumn("students", "userType", {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: 'student',
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("students", "onBoardedBy");
    await queryInterface.removeColumn("students", "onBoardedPersonId");
    await queryInterface.removeColumn("students", "onBoardedPersonName");
  },
};
