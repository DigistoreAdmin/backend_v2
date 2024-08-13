'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Check if the enum value "distributor" already exists before attempting to add it
    const enumValues = await queryInterface.sequelize.query(`
      SELECT enumlabel FROM pg_enum WHERE enumtypid = (
        SELECT oid FROM pg_type WHERE typname = 'enum_distributors_onBoardedBy'
      )
    `);

    const existingValues = enumValues[0].map((row) => row.enumlabel);

    // Add new ENUM value "distributor" only if it does not already exist
    if (!existingValues.includes('distributor')) {
      await queryInterface.sequelize.query(`
        ALTER TYPE "enum_distributors_onBoardedBy" ADD VALUE 'distributor';
      `);
    }

    // Change the column to use the updated ENUM values
    await queryInterface.changeColumn('franchises', 'onBoardedBy', {
      type: Sequelize.ENUM('distributor', 'fieldExecutive', 'teleCaller', 'collegeQuest', 'itsSelf', 'admin'),
      allowNull: false,
      validate: {
        notNull: {
          msg: 'onBoardedBy cannot be null',
        },
        notEmpty: {
          msg: 'onBoardedBy cannot be empty',
        },
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Revert the column to the previous ENUM values
    await queryInterface.changeColumn('franchises', 'onBoardedBy', {
      type: Sequelize.ENUM('fieldExecutive', 'teleCaller', 'collegeQuest', 'itsSelf', 'admin'),
      allowNull: false,
      validate: {
        notNull: {
          msg: 'onBoardedBy cannot be null',
        },
        notEmpty: {
          msg: 'onBoardedBy cannot be empty',
        },
      },
    });

    // Note: PostgreSQL does not support removing ENUM values directly.
    // If necessary, this step should involve recreating the ENUM type without the new values.
  },
};
