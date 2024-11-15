'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('user', 'userType', {
      type: Sequelize.ENUM('admin', 'distributor', 'franchise', 'student', 'staff', 'accountant'),
      allowNull: false,
    });
  },

  down: async (queryInterface, Sequelize) => {
    // For down migration, you’ll need to remove 'accountant' from the ENUM type
    await queryInterface.changeColumn('user', 'userType', {
      type: Sequelize.ENUM('admin', 'distributor', 'franchise', 'student', 'staff'),
      allowNull: false,
    });
  },
};
