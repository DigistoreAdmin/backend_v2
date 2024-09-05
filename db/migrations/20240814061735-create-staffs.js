"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("staffs", {
      employeeId: {
        type: Sequelize.STRING,
        primaryKey: true,
      },
      userType: {
        type: Sequelize.ENUM("staff"),
      },
      password: {
        type: Sequelize.STRING,
      },
      firstName: {
        type: Sequelize.STRING,
      },
      lastName: {
        type: Sequelize.STRING,
      },
      emailId: {
        type: Sequelize.STRING,
      },
      phoneNumber: {
        type: Sequelize.BIGINT,
      },
      dateOfBirth: {
        type: Sequelize.DATE,
      },
      gender: {
        type: Sequelize.ENUM("male", "female", "other"),
      },
      employment: {
        type: Sequelize.ENUM("trainee", "fullTime", "partTime"),
      },
      employmentType: {
        type: Sequelize.ENUM("fieldExecutive", "officeExecutive"),
      },
      addressLine1: {
        type: Sequelize.STRING,
      },
      addressLine2: {
        type: Sequelize.STRING,
      },
      bloodGroup: {
        type: Sequelize.STRING,
      },
      emergencyContact: {
        type: Sequelize.BIGINT,
      },
      districtOfOperation: {
        type: Sequelize.ARRAY(Sequelize.STRING),
      },
      reportingManager: {
        type: Sequelize.STRING,
      },
      dateOfJoin: {
        type: Sequelize.DATE,
      },
      isTrainingRequired: {
        type: Sequelize.BOOLEAN,
      },
      totalTrainingDays: {
        type: Sequelize.INTEGER,
      },
      employmentStartDate: {
        type: Sequelize.DATE,
      },
      city: {
        type: Sequelize.STRING,
      },
      district: {
        type: Sequelize.STRING,
      },
      state: {
        type: Sequelize.STRING,
      },
      pinCode: {
        type: Sequelize.INTEGER,
      },
      bank: {
        type: Sequelize.STRING,
      },
      accountNumber: {
        type: Sequelize.STRING,
      },
      ifscCode: {
        type: Sequelize.STRING,
      },
      accountHolderName: {
        type: Sequelize.STRING,
      },
      laptop: {
        type: Sequelize.STRING,
      },
      idCard: {
        type: Sequelize.STRING,
      },
      phone: {
        type: Sequelize.STRING,
      },
      sim: {
        type: Sequelize.STRING,
      },
      vistingCard: {
        type: Sequelize.STRING,
      },
      posterOrBroucher: {
        type: Sequelize.STRING,
      },
      other: {
        type: Sequelize.STRING,
      },
      remarks: {
        type: Sequelize.STRING,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      deletedAt: {
        type: Sequelize.DATE,
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("staffs");
  },
};
