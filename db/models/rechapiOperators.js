const { DataTypes } = require("sequelize");
const sequelize = require("../../config/database");

const operators = sequelize.define(
  "rechapiOperators",
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
    operatorId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    commission: {
      type: DataTypes.DECIMAL,
      allowNull: false,
    },
    gstMode:{
      type:DataTypes.STRING,
      allowNull: false,
    },
    rechargeType: {
      type: DataTypes.ENUM("prepaid", "postpaid","Dth","Electricity","Water","Fastag","Landline"),
      allowNull: false,
      defaultValue:"prepaid"
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
    modelName: "rechapiOperators",
  }
);

module.exports = operators;