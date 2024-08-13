'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('franchises', 'referredBy', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    });

    await queryInterface.addColumn('franchises', 'referredFranchiseName', {
      type: Sequelize.STRING,
      allowNull: true,
      validate: {
        notEmpty: {
          msg: 'Franchise name cannot be empty',
        },
      },
    });

    await queryInterface.addColumn('franchises', 'referredFranchiseCode', {
      type: Sequelize.STRING,
      allowNull: true,
      validate: {
        isInt: {
          msg: 'Franchise code must be an integer',
        },
      },
    });

    await queryInterface.addColumn('franchises', 'onBoardedBy', {
      type: Sequelize.ENUM('distributor', 'fieldExecutive', 'teleCaller', 'collegeQuest', 'itsSelf'),
      allowNull: false,
      defaultValue: 'itsSelf',
    });

    await queryInterface.addColumn('franchises', 'onBoardedPersonId', {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.addColumn('franchises', 'onBoardedPersonName', {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn('franchises', 'franchiseUniqueId', {
      type: Sequelize.STRING,
      allowNull: false,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('franchises', 'referredBy');
    await queryInterface.removeColumn('franchises', 'referredFranchiseName');
    await queryInterface.removeColumn('franchises', 'referredFranchiseCode');
    await queryInterface.removeColumn('franchises', 'onBoardedBy');
    await queryInterface.removeColumn('franchises', 'onBoardedPersonId');
    await queryInterface.removeColumn('franchises', 'onBoardedPersonName');
    await queryInterface.removeColumn('franchises', 'franchiseUniqueId');
  },
};
   