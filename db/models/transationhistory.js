const { DataTypes } = require("sequelize");
const sequelize = require("../../config/database");

const transationHistories = sequelize.define(
  "transationHistories",
  {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    uniqueId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    transactionId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    userName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    userType: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    service: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("pending", "fail","success"),
      allowNull: false,
    },
    amount: {
      type: DataTypes.DECIMAL,
      allowNull: false,
    },
    franchiseCommission: {
      type: DataTypes.DECIMAL,
      allowNull: true,
      defaultValue:0.00
    },
    adminCommission: {
      type: DataTypes.DECIMAL,
      allowNull: true,
      defaultValue:0.00
    },
    walletBalance: {
      type: DataTypes.DECIMAL,
      allowNull: false,
      defaultValue:0.00
    },
    typeOfTransation: {
      type: DataTypes.ENUM('debit', 'credit'),
      allowNull:true
    },
    deletedAt: {
      type: DataTypes.DATE,
    },
  },  {
    paranoid: true,
    freezeTableName: true,
    modelName: "transationHistories",
  }
);
 
module.exports = transationHistories;