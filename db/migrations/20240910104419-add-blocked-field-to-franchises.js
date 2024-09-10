'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('franchises', 'blocked', {
      type: Sequelize.ENUM('blocked', 'unBlocked'),
      allowNull: false,
      defaultValue: 'unBlocked',
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Remove the 'blocked' column
    await queryInterface.removeColumn('franchises', 'blocked');

    // Remove the ENUM type
    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS "enum_franchises_blocked";'
    );
  },
};
