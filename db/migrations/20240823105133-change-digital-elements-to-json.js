'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Step 1: Add a temporary column with JSON data type
    await queryInterface.addColumn('franchises', 'digitalElementsTemp', {
      type: Sequelize.JSON,
      allowNull: true,
    });

    // Step 2: Copy data from the original column to the new column with conversion
    await queryInterface.sequelize.query(`
      UPDATE "franchises"
      SET "digitalElementsTemp" = to_json("digitalElements"::text[])
    `);

    // Step 3: Remove the original column
    await queryInterface.removeColumn('franchises', 'digitalElements');

    // Step 4: Rename the temporary column to the original column name
    await queryInterface.renameColumn('franchises', 'digitalElementsTemp', 'digitalElements');
  },

  down: async (queryInterface, Sequelize) => {
    // Step 1: Add the original column back with ARRAY data type
    await queryInterface.addColumn('franchises', 'digitalElementsTemp', {
      type: Sequelize.ARRAY(Sequelize.STRING),
      allowNull: true,
    });

    // Step 2: Copy data back to the original type (if possible)
    await queryInterface.sequelize.query(`
      UPDATE "franchises"
      SET "digitalElementsTemp" = array(select jsonb_array_elements_text("digitalElements"::jsonb))
    `);

    // Step 3: Remove the JSON column
    await queryInterface.removeColumn('franchises', 'digitalElements');

    // Step 4: Rename the temporary column back to the original column name
    await queryInterface.renameColumn('franchises', 'digitalElementsTemp', 'digitalElements');
  },
};
