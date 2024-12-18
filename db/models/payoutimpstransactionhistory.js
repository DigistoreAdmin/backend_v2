"use strict";
const { DataTypes } = require("sequelize");
const sequelize = require("../../config/database");

const payoutImpsTransactionHistory = sequelize.define(
  "payoutImpsTransactionHistory",
  {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    status: {
      type: DataTypes.ENUM("SUCCESS","ERROR"),
      allowNull: true,
    },
    message: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    version: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    time: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    respCode: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    beneficiaryAccountNumber: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    beneficiaryName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    errorId: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    errorMessage: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    transcationType: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    paymentReferenceNumber: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    transactionReferenceNumber: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    transactionDate: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    amount1: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    status1: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    transactionTime: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    n10Time: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    suspenseReason: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    inOutTime: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    camt59Time: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    code: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    transactionID: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    reason: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    service: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    details: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    balance: {
      type: DataTypes.DECIMAL,
      allowNull: true,
    },
    bankCharge: {
      type: DataTypes.DECIMAL,
      allowNull: true,
    },
    HOCommission: {
      type: DataTypes.DECIMAL,
      allowNull: true,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    deletedAt: {
      type: DataTypes.DATE,
    },
  },
  {
    paranoid: true,
    freezeTableName: true,
    modelName: "payoutImpsTransactionHistory",
  }
);

module.exports = payoutImpsTransactionHistory;
