"use strict";
const { Model, DataTypes } = require("sequelize");
const sequelize = require("../../config/database");

module.exports = sequelize.define(
  "passportOffice",
  {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    place: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Place name cannot be null",
        },
        notEmpty: {
          msg: "Place cannot be empty",
        },
      },
    },
    zone: {
      type: DataTypes.ENUM,
      values: ["Cochin", "Trivandrum", "Kozhikode"],
      allowNull: false,
      validate: {
        notNull: {
          msg: "Zone cannot be null",
        },
        notEmpty: {
          msg: "Zone cannot be empty",
        },
        isIn: {
          args: [["Cochin", "Trivandrum", "Kozhikode"]],
          msg: "Zone must be either 'Cochin' or 'Trivandrum' or 'kozhikode'",
        },
      },
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    deletedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    paranoid: true,
    freezeTableName: true,
    modelName: "passportOffice",
  }
);
