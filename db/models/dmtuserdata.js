const { DataTypes } = require("sequelize");
const sequelize = require("../../config/database");
const Franchise = require("./franchise");



const dmtUserData = sequelize.define(
  "dmtUserData",
  {
    uniqueId: {
      type: DataTypes.INTEGER,
      allowNull: false ,
      references: {
        model: Franchise, 
        key: "id" 
      }
    },
    customerId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    Name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    Address: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    dateOfBirth: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    Otp: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    deletedAt: {
      type: DataTypes.DATE,
    }
  }, {
    paranoid: true,
    freezeTableName: true,
    modelName: "dmtUserData",  
  });
 
  dmtUserData.belongsTo(Franchise, { foreignKey: "uniqueId" });


  module.exports = dmtUserData;