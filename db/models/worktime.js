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
    startTime: {
      type: DataTypes.TIME,
      allowNull:true
    },
    endTime: {
      type: DataTypes.TIME,
      allowNull: true
    }, 
    totalWorkTimeWithoutBreak: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    breakTimeStarted: {
      type: DataTypes.TIME,
      allowNull: true,
    },
    breakTimeEnded: {
      type: DataTypes.TIME,
      allowNull: true,
    },
    totalBreakTime: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    totalWorkTimeWithBreak:{
      type: DataTypes.STRING,
      allowNull: true,
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