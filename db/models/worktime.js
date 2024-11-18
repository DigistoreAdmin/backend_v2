"use strict";
const { DataTypes } = require("sequelize");
const sequelize = require("../../config/database");

const WorkTime = sequelize.define(
  "workTime",
  {
    id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
    workId: {
      type: DataTypes.STRING,
      allowNull: true
    },
    employeeRecords: {
      type: DataTypes.ARRAY(DataTypes.JSON),
      defaultValue: [
        {
          staffName: {
            type: DataTypes.STRING,
          },
          assignedId: {
            type: DataTypes.STRING,
          },
          startTime: {
            type: DataTypes.STRING,
          },
          endTime: {
            type: DataTypes.STRING,
          },
          breakTimeStarted: {
            type: DataTypes.ARRAY(DataTypes.STRING)
          },
          breakTimeEnded: {
            type: DataTypes.ARRAY(DataTypes.DATE),
          },
          breakTime: {
            type: DataTypes.ARRAY(DataTypes.STRING),
          },
          totalBreakTime: {
            type: DataTypes.STRING,
          },
          totalTimeTaken: {
            type: DataTypes.STRING,
          },
          reassigned: {
            type: DataTypes.BOOLEAN,
          },
          reassignedTime: {
            type: DataTypes.STRING,
          },
        },
      ],
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