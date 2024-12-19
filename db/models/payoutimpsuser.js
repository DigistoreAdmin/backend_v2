"use strict";
const { DataTypes } = require("sequelize");

const sequelize = require("../../config/database");

const payoutImpsUser = sequelize.define(
  "payoutImpsUsers",
  {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    userName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Username cannot be empty",
        },
      },
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "password cannot be null",
        },
        notEmpty: {
          msg: "password cannot be empty",
        },
        len: {
          args: [8],
          msg: "Password must be at least 8 characters",
        },
      },
    },
    phoneNumber: {
      type: DataTypes.BIGINT,
      allowNull: true,
      validate: {
        isInt: {
          msg: "Phone number must contain only numbers",
        },
        len: {
          args: [10, 10],
          msg: "Phone number must be exactly 10 digits",
        },
      },
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
    modelName: "payoutImpsUsers",
  }
);

module.exports = payoutImpsUser;
