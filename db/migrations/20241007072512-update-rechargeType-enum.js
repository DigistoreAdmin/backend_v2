'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Add the new enum values (Prepaid, Postpaid) to the existing rechargeType enum type
    await queryInterface.sequelize.query(`
      DO $$ BEGIN
        ALTER TYPE "enum_operators_rechargeType" ADD VALUE 'Prepaid';
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `);

    await queryInterface.sequelize.query(`
      DO $$ BEGIN
        ALTER TYPE "enum_operators_rechargeType" ADD VALUE 'Postpaid';
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `);

    // Update the column to use the new enum values
    await queryInterface.changeColumn('operators', 'rechargeType', {
      type: Sequelize.ENUM('Prepaid', 'Postpaid', 'Dth', 'Electricity', 'Water', 'Fastag', 'Landline'),
      allowNull: false,
      defaultValue: 'Prepaid'
    });
  },

  down: async (queryInterface, Sequelize) => {
    // In the down migration, we should remove the new enum values (this is optional but recommended for rollback)
    // We cannot drop enum values in PostgreSQL, so we revert back to the old set of enum values
    await queryInterface.changeColumn('operators', 'rechargeType', {
      type: Sequelize.ENUM('prepaid', 'postpaid', 'Dth', 'Electricity', 'Water', 'Fastag', 'Landline'),
      allowNull: false,
      defaultValue: 'prepaid'
    });
  }
};
