"use strict";
const { DataTypes } = require("sequelize");
const sequelize = require("../../config/database");

const WorkTime = sequelize.define(
  "workTime",
  {
    workId: {
      type: DataTypes.STRING,
      allowNull: true
    },
    staffName: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull:true,
    },
    assignedId:{
      type: DataTypes.ARRAY(DataTypes.STRING),
    },
    startTime: {
      type: DataTypes.ARRAY(DataTypes.DATE),
      allowNull:true
    },
    endTime: {
      type: DataTypes.ARRAY(DataTypes.DATE),
      allowNull: true
    }, 
    totalWorkTimeWithoutBreak: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: true,
    },
    breakTimeStarted: {
      type: DataTypes.ARRAY(DataTypes.DATE),
      allowNull: true,
    },
    breakTimeEnded: {
      type: DataTypes.ARRAY(DataTypes.DATE),
      allowNull: true,
    },
    totalBreakTime: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: true,
    },
    totalWorkTimeWithBreak:{
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: true,
    },
    reassigned: {
      type: DataTypes.BOOLEAN,
    },
    reassignedTime: {
      type: DataTypes.ARRAY(DataTypes.DATE),
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE,
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE,
    },
    deletedAt: {
      type: DataTypes.DATE,
    },
  },
  {
    paranoid: true,
    freezeTableName: true,
    modelName: "workTime",
  }
);

module.exports = WorkTime;