const { DataTypes } = require("sequelize");
const sequelize = require("../../config/database");
const Franchise = require("./franchise");



const wallets = sequelize.define(
  "wallets",
  {
    uniqueId: {
      type: DataTypes.INTEGER,
      allowNull: false ,
      references: {
        model: Franchise, 
        key: "id" 
      }
    },
    balance: {
      type: DataTypes.DECIMAL,  
      allowNull: false,                
      defaultValue: "0.00"
    },
    deletedAt: {
      type: DataTypes.DATE,
    }
  },{
    paranoid: true,
    freezeTableName: true,
    modelName: "wallets",  
  }
  
);

wallets.belongsTo(Franchise, { foreignKey: "uniqueId" });


module.exports = wallets;