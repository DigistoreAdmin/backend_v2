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
      workId: {
        type: Sequelize.STRING,
      },
      status:{
        type: Sequelize.ENUM('inQueue','inProgress','completed',"onHold","rejected"),
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
      email: {
        type: Sequelize.STRING,
      },
      phoneNumber: {
        type: Sequelize.BIGINT,
      },
      fatherName: {
        type: Sequelize.STRING,
      },
      aadhaarNumber: {
        type: Sequelize.STRING,
      },
      aadhaarFront: {
        type: Sequelize.STRING,
      },
      aadhaarBack: {
        type: Sequelize.STRING,
      },
      proofOfDOB: {
        type: Sequelize.STRING,
      },
      proofOfAddress: {
        type: Sequelize.STRING,
      },
      photo: {
        type: Sequelize.STRING,
      },
      signature: {
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
      changeFatherName:{
        type: Sequelize.STRING,
      },

      // Fields specific to 'minor' PAN
      representativeName: {
        type: Sequelize.STRING,
      },
      representativeRelation:{
        type: Sequelize.STRING,
      },
      representativeAadhaarFront: {
        type: Sequelize.STRING,
      },
      representativeAadhaarBack: {
        type: Sequelize.STRING,
      },
      representativeSignature: {
        type: Sequelize.STRING,
      },


      // Field specific to 'NRI' PAN
      abroadAddress: {
        type: Sequelize.STRING,
      },
      proofOfIdentity: {
        type: Sequelize.STRING,
      },
      
      acknowledgementNumber:{
        type: Sequelize.STRING,
      },
      acknowledgementFile:{
        type: Sequelize.STRING,
      },
      reason:{
        type: Sequelize.STRING,
      },
      ePan:{
        type: Sequelize.BOOLEAN,
      },
      commissionToHO: {
        type: Sequelize.DECIMAL,
       
      },
      commissionToFranchise: {
        type: Sequelize.DECIMAL,
        
      },
      totalAmount: {
        type: Sequelize.DECIMAL,
      },
      createdAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
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
