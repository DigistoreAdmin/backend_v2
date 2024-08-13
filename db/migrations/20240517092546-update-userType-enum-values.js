'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('user', 'userType', {
      type: Sequelize.ENUM('admin', 'distributor', 'franchise'),
      allowNull: false,
      validate: {
        notNull: {
          msg: 'userType cannot be null',
        },
        notEmpty: {
          msg: 'userType cannot be empty',
        },
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('user', 'userType', {
      type: Sequelize.ENUM('0', '1', '2'),
      allowNull: false,
      validate: {
        notNull: {
          msg: 'userType cannot be null',
        },
        notEmpty: {
          msg: 'userType cannot be empty',
        },
      },
    });
  }
};
