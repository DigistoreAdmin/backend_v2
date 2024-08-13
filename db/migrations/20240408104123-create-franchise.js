"use strict";

const { STRING } = require("sequelize");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("franchises", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      userType: {
        type: Sequelize.STRING,
      },
      ownerName: {
        type: Sequelize.STRING,
      },
      franchiseName: {
        type: Sequelize.STRING,
      },
      businessType: {
        type: Sequelize.STRING,
      },
      phoneNumber: {
        type: Sequelize.BIGINT,
      },
      email: {
        type: Sequelize.STRING,
      },
      password: {
        type: Sequelize.STRING,
      },
      gender: {
        type: Sequelize.ENUM("male", "female", "other"),
      },
      dateOfBirth: {
        type: Sequelize.STRING,
      },
      franchiseAddressLine1: {
        type: Sequelize.STRING,
      },
      franchiseAddressLine2: {
        type: Sequelize.STRING,
      },
      state: {
        type: Sequelize.STRING,
      },
      district: {
        type: Sequelize.STRING,
      },
      pinCode: {
        type: Sequelize.STRING,
      },
      postOffice: {
        type: Sequelize.STRING,
      },
      panchayath: {
        type: Sequelize.STRING,
      },
      ward: {
        type: Sequelize.STRING,
      },
      digitalElements: {
        type: Sequelize.ARRAY(STRING),
      },
      panCenter: {
        type: Sequelize.BOOLEAN,
      },
      accountNumber: {
        type: Sequelize.STRING,
      },
      accountName: {
        type: Sequelize.STRING,
      },
      bank: {
        type: Sequelize.STRING,
      },
      branchName: {
        type: Sequelize.STRING,
      },
      ifscCode: {
        type: Sequelize.STRING,
      },
      aadhaarNumber: {
        type: Sequelize.STRING,
      },
      panNumber: {
        type: Sequelize.STRING,
      },
      aadhaarPicFront: {
        type: Sequelize.STRING,
      },
      aadhaarPicback: {
        type: Sequelize.STRING,
      },
      panPic: {
        type: Sequelize.STRING,
      },
      bankPassbookPic: {
        type: Sequelize.STRING,
      },
      shopPic: {
        type: Sequelize.STRING,
      },
      deletedAt: {
        type: Sequelize.DATE,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("franchises");
  },
};
