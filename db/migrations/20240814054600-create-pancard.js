"use strict";

const { STRING } = require("sequelize");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize){
    await queryInterface.createTable('pancardUser', {
      id: {
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      uniqueId: {
        type:Sequelize.STRING,
      },
      status:{
        type: Sequelize.ENUM('inQueue','inProgress','completed'),
        default:'inQueue',
      },
      assignedId:{
        type: Sequelize.STRING,
      },
      assignedOn:{
        type: Sequelize.DATE,
      },
      completedOn:{
        type: Sequelize.DATE,
      },
      panType: {
        type: Sequelize.ENUM('newPancard', 'duplicateOrChangePancard', 'minorPancard', 'NRIPancard'),
      },      
      customerName: {
        type: Sequelize.STRING,
      },
      emailID: {
        type: Sequelize.STRING,
      },
      mobileNumber: {
        type: Sequelize.BIGINT,
      },
      fatherName: {
        type: Sequelize.STRING,
      },
      proofOfIdentity: {
        type: Sequelize.STRING,
      },
      proofOfDOB: {
        type: Sequelize.STRING,
      },
      proofOfAddress: {
        type: Sequelize.STRING,
      },

      // Fields specific to 'new' PAN
      isCollege: {
        type: Sequelize.BOOLEAN,
      },
      collegeID: {
        type: Sequelize.STRING,
      },
      coordinatorID: {
        type: Sequelize.STRING,
      },
      coordinatorName: {
        type: Sequelize.STRING,
      },

      isDuplicateOrChangePan: {
        type: Sequelize.ENUM('duplicate','change'),
      },

      // Fields specific to 'duplicate' PAN
      reasonForDuplicate: {
        type: Sequelize.STRING,
      },

      // Fields specific to 'change' PAN
      panNumber: {
        type: Sequelize.STRING,
      },
      nameChange: {
        type: Sequelize.STRING,
      },
      addressChange: {
        type: Sequelize.STRING,
      },
      dobChange: {
        type: Sequelize.STRING,
      },
      signatureChange: {
        type: Sequelize.STRING,
      },
      photoChange: {
        type: Sequelize.STRING,
      },
      changeFatherName:{
        type: Sequelize.STRING,
      },

      // Fields specific to 'minor' PAN
      representativeName: {
        type: Sequelize.STRING,
      },
      representativeAddress: {
        type: Sequelize.STRING,
      },
      representativeRelatiion:{
        type: Sequelize.STRING,
      },
      representativeDocument: {
        type: Sequelize.STRING,
      },

      // Field specific to 'NRI' PAN
      nriAddress: {
        type: Sequelize.STRING,
      },

      createdAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      },
      deletedAt: {
        type: Sequelize.DATE
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('pancardUser');
  }
};