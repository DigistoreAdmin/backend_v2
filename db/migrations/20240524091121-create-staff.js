'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('staff', {
      employeeId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      firstName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      lastName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      emailId: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          isEmail: true,
        },
      },
      mobileNumber: {
        type: Sequelize.INTEGER,
        allowNull: false,
        validate: {
          isInt: true,
          len: [10, 10],
        },
      },
      dateOfBirth: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      gender: {
        type: Sequelize.ENUM('Male', 'Female', 'Other'),
        allowNull: false,
      },
      addressLine1: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      addressLine2: {
        type: Sequelize.STRING,
      },
      city: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      district: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      state: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      pinCode: {
        type: Sequelize.INTEGER,
        allowNull: false,
        validate: {
          isInt: true,
          len: [6, 6],
        },
      },
      bank: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      accountNumber: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      ifscCode: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      accountHolderName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      staffType: {
        type: Sequelize.ENUM('Office Staff', 'Field Executive Staff'),
        allowNull: false,
      },
      districtOfOperation: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      reportingManager: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      laptop: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      idCard: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      sim: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      other: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      phone: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      remarks: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('now'),
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('now'),
      },
    });

    await queryInterface.addConstraint('staff', {
      fields: ['districtOfOperation', 'reportingManager', 'laptop', 'idCard', 'sim', 'other', 'phone', 'remarks'],
      type: 'check',
      where: {
        staffType: 'Field Executive Staff',
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('staff');
  }
};
