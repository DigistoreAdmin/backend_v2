"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Check if the enum values already exist before attempting to add them
    const enumValues = await queryInterface.sequelize.query(`
      SELECT enumlabel FROM pg_enum WHERE enumtypid = (
        SELECT oid FROM pg_type WHERE typname = 'enum_user_userType'
      )
    `);

    const existingValues = enumValues[0].map((row) => row.enumlabel);

    // Add new ENUM values only if they do not already exist
    const newValues = ["admin", "distributor", "franchise"].filter(
      (value) => !existingValues.includes(value)
    );
    if (newValues.length > 0) {
      await queryInterface.sequelize.query(`
        ALTER TYPE "enum_user_userType" ADD VALUE '${newValues[0]}';
        ALTER TYPE "enum_user_userType" ADD VALUE '${newValues[1]}';
        ALTER TYPE "enum_user_userType" ADD VALUE '${newValues[2]}';
      `);

      // Update existing data to use the new ENUM values
      await queryInterface.sequelize.query(`
        UPDATE "user" SET "userType" = '${newValues[0]}' WHERE "userType" = '0';
        UPDATE "user" SET "userType" = '${newValues[1]}' WHERE "userType" = '1';
        UPDATE "user" SET "userType" = '${newValues[2]}' WHERE "userType" = '2';
      `);
    }

    // Change the column to use the new ENUM values
    await queryInterface.changeColumn("user", "userType", {
      type: Sequelize.ENUM("admin", "distributor", "franchise"),
      allowNull: false,
      validate: {
        notNull: {
          msg: "userType cannot be null",
        },
        notEmpty: {
          msg: "userType cannot be empty",
        },
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Revert the column back to the old ENUM values
    await queryInterface.changeColumn("user", "userType", {
      type: Sequelize.ENUM("0", "1", "2"),
      allowNull: false,
      validate: {
        notNull: {
          msg: "userType cannot be null",
        },
        notEmpty: {
          msg: "userType cannot be empty",
        },
      },
    });

    // Revert data changes
    await queryInterface.sequelize.query(`
      UPDATE "user" SET "userType" = '0' WHERE "userType" = 'admin';
      UPDATE "user" SET "userType" = '1' WHERE "userType" = 'distributor';
      UPDATE "user" SET "userType" = '2' WHERE "userType" = 'franchise';
    `);

    // Note: PostgreSQL does not support removing ENUM values directly.
    // If necessary, this step should involve recreating the ENUM type without the new values.
  },
};