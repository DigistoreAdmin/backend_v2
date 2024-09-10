'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.addColumn('user', 'blocked', {
      type: Sequelize.ENUM('blocked', 'unBlocked'),
      allowNull: false,
      defaultValue: 'unBlocked',
    });
  },

  down: async (queryInterface, Sequelize) => {
    // First, drop the ENUM type before removing the column
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_user_blocked";');
    return queryInterface.removeColumn('user', 'blocked');
  },
};
