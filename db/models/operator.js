const { DataTypes } = require("sequelize");
const sequelize = require("../../config/database");

const operators = sequelize.define(
  "operators",
  {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    commissionType: {
      type: DataTypes.ENUM("percentage", "flat"),
      allowNull: false,
      defaultValue: "percentage"
    },
    serviceProvider: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    SP_key: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    commission: {
      type: DataTypes.DECIMAL,
      allowNull: false,
    },
    rechargeType: {
      type: DataTypes.ENUM("Prepaid", "Postpaid","Dth","Electricity","Water","Fastag","Landline"),
      allowNull: false,
      defaultValue:"Prepaid"
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
    modelName: "operators",
  }
);

module.exports = operators;
