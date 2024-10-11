"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("gstRegistrations", {
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
      customerName: {
        type: Sequelize.STRING,
      },
      applicationReferenceNumber: {
        type: Sequelize.STRING,
      },
      commissionToHeadOffice: {
        type: Sequelize.DECIMAL,
      },
      commissionToFranchise: {
        type: Sequelize.DECIMAL,
      },
      totalAmount: {
        type: Sequelize.DECIMAL,
      },
      status: {
        type: Sequelize.ENUM("inQueue", "inProgress", "completed"),
      },
      customerEmailId: {
        type: Sequelize.STRING,
      },
      customerMobile: {
        type: Sequelize.BIGINT,
      },
      businessName: {
        type: Sequelize.STRING,
      },
      businessAddressLine1: {
        type: Sequelize.STRING,
      },
      businessAddressLine2: {
        type: Sequelize.STRING,
      },
      pinCode: {
        type: Sequelize.INTEGER,
      },
      building: {
        type: Sequelize.ENUM("owned", "rent/leased"),
      },
      shopLatitude: {
        type: Sequelize.STRING,
      },
      shopLongitude: {
        type: Sequelize.STRING,
      },
      typeOfBusiness: {
        type: Sequelize.ENUM("proprietary", "partnership", "company"),
      },
      panCardImage: {
        type: Sequelize.STRING,
      },
      aadhaarFront: {
        type: Sequelize.STRING,
      },
      aadhaarBack: {
        type: Sequelize.STRING,
      },
      gstDocument: {
        type: Sequelize.STRING,
      },
      buildingTaxReceipt: {
        type: Sequelize.STRING,
      },
      rentAgreement: {
        type: Sequelize.STRING,
      },
      passportSizePhoto: {
        type: Sequelize.STRING,
      },
      bankDetails: {
        type: Sequelize.STRING,
      },
      landTaxReceipt: {
        type: Sequelize.STRING,
      },
      shopGmapPic: {
        type: Sequelize.STRING,
      },
      residenceLatitude: {
        type: Sequelize.STRING,
      },
      residenceLongitude: {
        type: Sequelize.STRING,
      },
      noOfPartners: {
        type: Sequelize.INTEGER,
      },
      partnersDetails: {
        type: Sequelize.JSONB,
      },
      partnershipDeed: {
        type: Sequelize.STRING,
      },
      noObjectionCertificate: {
        type: Sequelize.STRING,
      },
      propertyTaxReceipt: {
        type: Sequelize.STRING,
      },
      noOfDirectors: {
        type: Sequelize.INTEGER,
      },
      directorsDetails: {
        type: Sequelize.JSONB,
      },
      incorporationCertificate: {
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
    await queryInterface.dropTable("gstRegistrations");
  },
};
