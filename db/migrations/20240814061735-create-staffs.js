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
      email: {
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
      branchName: {
        type: Sequelize.STRING,
      },
      accountNumber: {
        type: Sequelize.STRING,
      },
      ifscCode: {
        type: Sequelize.STRING,
      },
      accountName: {
        type: Sequelize.STRING,
      },
      laptop: {
        type: Sequelize.BOOLEAN,
      },
      idCard: {
        type: Sequelize.BOOLEAN,
      },
      phone: {
        type: Sequelize.BOOLEAN,
      },
      sim: {
        type: Sequelize.BOOLEAN,
      },
      vistingCard: {
        type: Sequelize.BOOLEAN,
      },
      posterOrBroucher: {
        type: Sequelize.BOOLEAN,
      },
      other: {
        type: Sequelize.BOOLEAN,
      },
      laptopDetails: {
        type: Sequelize.STRING,
      },
      idCardDetails: {
        type: Sequelize.STRING,
      },
      phoneDetails: {
        type: Sequelize.STRING,
      },
      simDetails: {
        type: Sequelize.STRING,
      },
      vistingCardDetails: {
        type: Sequelize.STRING,
      },
      posterOrBroucherDetails: {
        type: Sequelize.STRING,
      },
      otherDetails: {
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

    const enumValues = await queryInterface.sequelize.query(`
      SELECT enumlabel FROM pg_enum WHERE enumtypid = (
        SELECT oid FROM pg_type WHERE typname = 'enum_staffs_userType'
      )
    `);

    const existingValues = enumValues[0].map((row) => row.enumlabel);

    if (!existingValues.includes("staff")) {
      await queryInterface.sequelize.query(`
        ALTER TYPE "enum_staffs_userType" ADD VALUE 'staff';
      `);
    }
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("staffs");
  },
};
