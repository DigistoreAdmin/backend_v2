"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("vehicleInsurances", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      uniqueId: {
        type: Sequelize.STRING,
      },
      workId: {
        type: Sequelize.STRING,
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
      status: {
        type: Sequelize.ENUM("inQueue", "inProgress", "completed"),
      },
      customerName: {
        type: Sequelize.STRING,
      },
      mobileNumber: {
        type: Sequelize.BIGINT,
      },
      emailId: {
        type: Sequelize.STRING,
      },
      insuranceType: {
        type: Sequelize.ENUM(
          "fullCover",
          "bumberToBumber",
          "thirdParty",
          "standAlone"
        ),
      },
      anyClaims: {
        type: Sequelize.BOOLEAN,
      },
      previousPolicyDocument: {
        type: Sequelize.STRING,
      },
      rcFront: {
        type: Sequelize.STRING,
      },
      rcBack: {
        type: Sequelize.STRING,
      },
      aadhaarFront: {
        type: Sequelize.STRING,
      },
      aadhaarBack: {
        type: Sequelize.STRING,
      },
      panPic: {
        type: Sequelize.STRING,
      },
      commercialOrType2Vehicle: {
        type: Sequelize.BOOLEAN,
      },
      otherDocuments: {
        type: Sequelize.STRING,
      },
      isPolicyExpired: {
        type: Sequelize.BOOLEAN,
      },
      vehicleFrontSide: {
        type: Sequelize.STRING,
      },
      vehicleBackSide: {
        type: Sequelize.STRING,
      },
      vehicleLeftSide: {
        type: Sequelize.STRING,
      },
      vehicleRightSide: {
        type: Sequelize.STRING,
      },
      vehicleEngineNumber: {
        type: Sequelize.STRING,
      },
      vehicleChasisNumber: {
        type: Sequelize.STRING,
      },
      policyDocument: {
        type: Sequelize.STRING,
      },
      companyName: {
        type: Sequelize.STRING,
      },
      throughWhom: {
        type: Sequelize.ENUM("GIBIL", "ownCode"),
      },
      commissionToFranchise: {
        type: Sequelize.DECIMAL,
      },
      commissionToHeadOffice: {
        type: Sequelize.DECIMAL,
      },
      odPremiumAmount: {
        type: Sequelize.DECIMAL,
      },
      tpPremiumAmount:{
        type: Sequelize.DECIMAL,
      },
      odPoint: {
        type: Sequelize.DECIMAL,
      },
      tpPoint: {
        type: Sequelize.DECIMAL,
      },
      paCoverPoint: {
        type: Sequelize.DECIMAL,
      },
      paCoverAmount: {
        type: Sequelize.DECIMAL,
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
    await queryInterface.dropTable("vehicleInsurances");
  },
};