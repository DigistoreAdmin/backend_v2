'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Step 1: Add new columns with the correct types
    await queryInterface.addColumn('franchises', 'newPhoneNumber', {
      type: Sequelize.BIGINT,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Phone number cannot be null',
        },
        notEmpty: {
          msg: 'Phone number cannot be empty',
        },
        isInt: {
          msg: 'Phone number must be an integer',
        },
        len: {
          args: [10, 10],
          msg: 'Phone number must be exactly 10 digits',
        },
      },
    });
    await queryInterface.addColumn('franchises', 'newDateOfBirth', {
      type: Sequelize.DATE,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Date of birth cannot be null',
        },
        notEmpty: {
          msg: 'Date of birth cannot be empty',
        },
      },
    });
    await queryInterface.addColumn('franchises', 'newPinCode', {
      type: Sequelize.BIGINT,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Pin code cannot be null',
        },
        notEmpty: {
          msg: 'Pin code cannot be empty',
        },
        isInt: {
          msg: 'Pin code must be an integer',
        },
      },
    });
    await queryInterface.addColumn('franchises', 'newAccountNumber', {
      type: Sequelize.BIGINT,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Account number cannot be null',
        },
        notEmpty: {
          msg: 'Account number cannot be empty',
        },
        isInt: {
          msg: 'Account number must be an integer',
        },
      },
    });
    await queryInterface.addColumn('franchises', 'newAadhaarNumber', {
      type: Sequelize.BIGINT,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Aadhaar number cannot be null',
        },
        notEmpty: {
          msg: 'Aadhaar number cannot be empty',
        },
        isInt: {
          msg: 'Aadhaar number must be an integer',
        },
      },
    });

    // Step 2: Copy data from the old columns to the new columns, converting as needed
    await queryInterface.sequelize.query(`
      UPDATE franchises
      SET "newPhoneNumber" = CAST("phoneNumber" AS BIGINT),
          "newDateOfBirth" = "dateOfBirth"::DATE,
          "newPinCode" = CAST("pinCode" AS BIGINT),
          "newAccountNumber" = CAST("accountNumber" AS BIGINT),
          "newAadhaarNumber" = CAST("aadhaarNumber" AS BIGINT)
    `);

    // Step 3: Drop the old columns
    await queryInterface.removeColumn('franchises', 'phoneNumber');
    await queryInterface.removeColumn('franchises', 'dateOfBirth');
    await queryInterface.removeColumn('franchises', 'pinCode');
    await queryInterface.removeColumn('franchises', 'accountNumber');
    await queryInterface.removeColumn('franchises', 'aadhaarNumber');

    // Step 4: Rename the new columns to match the old column names
    await queryInterface.renameColumn('franchises', 'newPhoneNumber', 'phoneNumber');
    await queryInterface.renameColumn('franchises', 'newDateOfBirth', 'dateOfBirth');
    await queryInterface.renameColumn('franchises', 'newPinCode', 'pinCode');
    await queryInterface.renameColumn('franchises', 'newAccountNumber', 'accountNumber');
    await queryInterface.renameColumn('franchises', 'newAadhaarNumber', 'aadhaarNumber');
  },

  down: async (queryInterface, Sequelize) => {
    // Revert changes if needed (similar steps, creating old columns again and copying data back)
    await queryInterface.addColumn('franchises', 'oldPhoneNumber', {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Phone number cannot be null',
        },
        notEmpty: {
          msg: 'Phone number cannot be empty',
        },
      },
    });
    await queryInterface.addColumn('franchises', 'oldDateOfBirth', {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Date of birth cannot be null',
        },
        notEmpty: {
          msg: 'Date of birth cannot be empty',
        },
      },
    });
    await queryInterface.addColumn('franchises', 'oldPinCode', {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Pin code cannot be null',
        },
        notEmpty: {
          msg: 'Pin code cannot be empty',
        },
      },
    });
    await queryInterface.addColumn('franchises', 'oldAccountNumber', {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Account number cannot be null',
        },
        notEmpty: {
          msg: 'Account number cannot be empty',
        },
      },
    });
    await queryInterface.addColumn('franchises', 'oldAadhaarNumber', {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Aadhaar number cannot be null',
        },
        notEmpty: {
          msg: 'Aadhaar number cannot be empty',
        },
      },
    });

    await queryInterface.sequelize.query(`
      UPDATE franchises
      SET "oldPhoneNumber" = CAST("phoneNumber" AS VARCHAR),
          "oldDateOfBirth" = "dateOfBirth"::TEXT,
          "oldPinCode" = CAST("pinCode" AS VARCHAR),
          "oldAccountNumber" = CAST("accountNumber" AS VARCHAR),
          "oldAadhaarNumber" = CAST("aadhaarNumber" AS VARCHAR)
    `);

    await queryInterface.removeColumn('franchises', 'phoneNumber');
    await queryInterface.removeColumn('franchises', 'dateOfBirth');
    await queryInterface.removeColumn('franchises', 'pinCode');
    await queryInterface.removeColumn('franchises', 'accountNumber');
    await queryInterface.removeColumn('franchises', 'aadhaarNumber');

    await queryInterface.renameColumn('franchises', 'oldPhoneNumber', 'phoneNumber');
    await queryInterface.renameColumn('franchises', 'oldDateOfBirth', 'dateOfBirth');
    await queryInterface.renameColumn('franchises', 'oldPinCode', 'pinCode');
    await queryInterface.renameColumn('franchises', 'oldAccountNumber', 'accountNumber');
    await queryInterface.renameColumn('franchises', 'oldAadhaarNumber', 'aadhaarNumber');
  }
};
