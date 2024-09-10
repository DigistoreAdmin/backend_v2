'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query(`
      DO $$ 
      BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'enum_users_usertype') THEN
          CREATE TYPE "enum_users_usertype" AS ENUM('admin', 'distributor', 'franchise', 'student');
        END IF;
        ALTER TYPE "enum_users_usertype" ADD VALUE IF NOT EXISTS 'staff';
      END$$;
    `);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query(`
      DO $$ 
      BEGIN
        IF EXISTS (SELECT 1 FROM pg_type WHERE typname = 'enum_users_usertype') THEN
          DELETE FROM pg_enum
          WHERE enumlabel = 'staff'
          AND enumtypid = (SELECT oid FROM pg_type WHERE typname = 'enum_users_usertype');
        END IF;
      END$$;
    `);
  }
};
