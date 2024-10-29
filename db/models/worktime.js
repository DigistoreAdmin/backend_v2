"use strict";
const { DataTypes } = require("sequelize");
const sequelize = require("../../config/database");

const WorkTime = sequelize.define(
  "WorkTime",
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
    timeTaken: {
      type: DataTypes.TIME,
      allowNull: true,
    },
    breakStarted: {
      type: DataTypes.TIME,
      allowNull: true,
    },
    breakEnded: {
      type: DataTypes.TIME,
      allowNull: true,
    },
    totalBreakTime: {
      type: DataTypes.TIME,
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
    modelName: "WorkTime",
  }
);

module.exports = WorkTime;