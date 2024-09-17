'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Check if the enum value "student" already exists before attempting to add it
    const enumValues = await queryInterface.sequelize.query(`
      SELECT enumlabel FROM pg_enum WHERE enumtypid = (
        SELECT oid FROM pg_type WHERE typname = 'enum_user_userType'
      )
    `);

    const existingValues = enumValues[0].map((row) => row.enumlabel);

    // Add new ENUM value "student" only if it does not already exist
    if (!existingValues.includes('student')) {
      await queryInterface.sequelize.query(`
        ALTER TYPE "enum_user_userType" ADD VALUE 'student';
      `);
    }
    if (!existingValues.includes('staff')) {
      await queryInterface.sequelize.query(`
        ALTER TYPE "enum_user_userType" ADD VALUE 'staff';
      `);
    }

    // Change the column to use the updated ENUM values
    await queryInterface.changeColumn('user', 'userType', {
      type: Sequelize.ENUM('admin', 'distributor', 'franchise', 'student','staff'),
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
    // Revert the column to the previous ENUM values
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

    // Note: PostgreSQL does not support removing ENUM values directly.
    // If necessary, this step should involve recreating the ENUM type without the new values.
  },
};
