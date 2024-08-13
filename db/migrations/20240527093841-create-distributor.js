'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('distributors', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      userType: {
        type: Sequelize.STRING
      },
      password: {
        type: Sequelize.STRING
      },
      mobileNumber: {
        type: Sequelize.BIGINT
      },
      name: {
        type: Sequelize.STRING
      },
      distributorName: {
        type: Sequelize.STRING
      },
      email: {
        type: Sequelize.STRING
      },
      gender: {
        type: Sequelize.ENUM('male', 'female')
      },
      dateOfBirth: {
        type: Sequelize.DATE
      },
      district: {
        type: Sequelize.STRING
      },
      state: {
        type: Sequelize.STRING
      },
      bankName: {
        type: Sequelize.STRING
      },
      accountNumber: {
        type: Sequelize.STRING
      },
      ifscCode: {
        type: Sequelize.STRING
      },
      accountName: {
        type: Sequelize.STRING
      },
      aadhaarNumber: {
        type: Sequelize.STRING
      },
      panNumber: {
        type: Sequelize.STRING
      },
      aadhaarFrontImage: {
        type: Sequelize.STRING
      },
      aadhaarBackImage: {
        type: Sequelize.STRING
      },
      panCardImage: {
        type: Sequelize.STRING
      },
      bankPassbookImage: {
        type: Sequelize.STRING
      },
      distributorAddressLine1: {
        type: Sequelize.STRING
      },
      distributorAddressLine2: {
        type: Sequelize.STRING
      },
      postOffice: {
        type: Sequelize.STRING
      },
      pinCode: {
        type: Sequelize.BIGINT
      },
      branchName: {
        type: Sequelize.STRING
      },
      onBoardedBy: {
        type: Sequelize.ENUM("admin","fieldExecutive","teleCaller","collegeQuest","itsSelf"),
      },
      onBoardedPersonId: {
        type: Sequelize.STRING
      },
      onBoardedPersonName: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      deletedAt: {
        type: Sequelize.DATE,
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('distributors');
  }
};
