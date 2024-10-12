"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("passport", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      uniqueId: {
        type: Sequelize.STRING,
      },
      status: {
        type: Sequelize.ENUM("inQueue", "inProgress", "completed","onHold","reject"),
      },
      assignedId: {
        type: Sequelize.STRING,
      },
      assignedOn: {
        type: Sequelize.DATE,
      },
      completedOn: {
        type: Sequelize.DATE,
      },
      oldPassportNumber: {
        type: Sequelize.STRING,
      },
      customerName: {
        type: Sequelize.STRING,
      },
      customerEmail: {
        type: Sequelize.STRING,
      },
      mobileNumber: {
        type: Sequelize.BIGINT,
      },
      educationQualification: {
        type: Sequelize.STRING,
      },
      personalAddress: {
        type: Sequelize.STRING,
      },
      maritalStatus: {
        type: Sequelize.ENUM("yes", "no"),
      },
      spouseName: {
        type: Sequelize.STRING,
      },
      employmentType: {
        type: Sequelize.STRING,
      },
      birthPlace: {
        type: Sequelize.STRING,
      },
      identificationMark1: {
        type: Sequelize.STRING,
      },
      identificationMark2: {
        type: Sequelize.STRING,
      },
      policeStation: {
        type: Sequelize.STRING,
      },
      village: {
        type: Sequelize.STRING,
      },
      emergencyContactPerson: {
        type: Sequelize.STRING,
      },
      emergencyContactNumber: {
        type: Sequelize.BIGINT,
      },
      emergencyContactAddress: {
        type: Sequelize.STRING,
      },
      passportOfficePreference: {
        type: Sequelize.STRING,
      },
      appointmentDatePreference1: {
        type: Sequelize.DATE,
      },
      appointmentDatePreference2: {
        type: Sequelize.DATE,
      },
      appointmentDatePreference3: {
        type: Sequelize.DATE,
      },
      proofOfIdentity: {
        type: Sequelize.STRING,
      },
      proofOfDob: {
        type: Sequelize.STRING,
      },
      proofOfAddress: {
        type: Sequelize.STRING,
      },
      oldPassportCopy: {
        type: Sequelize.STRING,
      },
      passportAppointmentDate: {
        type: Sequelize.DATE,
      },
      username: {
        type: Sequelize.STRING,
      },
      password: {
        type: Sequelize.STRING,
      },
      passportFile: {
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
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("passport");
  },
};
