const { DataTypes } = require("sequelize");
const sequelize = require("../../config/database");
const Franchise = require("./franchise");

const userPlans = sequelize.define(
  "userPlans",
  {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    planType: {
      type: DataTypes.ENUM('free', 'paid'),
      allowNull: false,
      defaultValue: 'free'
    },
    modeOfPayment: {
      type: DataTypes.ENUM('cash', 'online', 'cheque', 'upi'),
      allowNull: true, 
      defaultValue:"cash"
  
    },
    amountCollected: {
      type: DataTypes.INTEGER, // Changed to INTEGER
      allowNull: true 
    },
    cgstPercent: {
      type: DataTypes.DECIMAL(10, 2), // Changed to DECIMAL(10,2)
      allowNull: true 
    },
    gstPercent: {
      type: DataTypes.DECIMAL(10, 2), // Changed to DECIMAL(10,2)
      allowNull: true 
    },
    totalGst: {
      type: DataTypes.DECIMAL(10, 2), // Changed to DECIMAL(10,2)
      allowNull: true 
    },
    discount: {
      type: DataTypes.INTEGER, // Changed to INTEGER
      allowNull: true 
    },
    balanceAmount: {
      type: DataTypes.DECIMAL(10, 2), // Changed to DECIMAL(10,2)
      allowNull: true 
    },
    collectedBy: {
      type: DataTypes.STRING,
      allowNull: true 
    },
    planId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    deletedAt: {
      type: DataTypes.DATE,
    },
  },{
    paranoid: true,
    freezeTableName: true,
    modelName: "userPlans",  
  }
);

// userPlans.belongsTo(Franchise, { foreignKey: 'franchiseId' }); // Define the association

userPlans.beforeCreate((userPlan, options) => {
  // const taxRate = 9; // Assuming 9% CGST and 9% SGST
  // const cgstPercent = taxRate;
  // const gstPercent = taxRate;
  if (userPlan.planType === 'paid') {
    const cgstAmount = (userPlan.amountCollected * 9) / 100;
    const gstAmount = (userPlan.amountCollected * 9) / 100;

    userPlan.cgstPercent = cgstAmount;
    userPlan.gstPercent = gstAmount;
    userPlan.totalGst = cgstAmount + gstAmount;
    userPlan.balanceAmount = userPlan.amountCollected + userPlan.totalGst - userPlan.discount;
  }

});

userPlans.beforeCreate((userPlans, options) => {
  if (userPlans.planType === 'paid') {
    if (!userPlans.modeOfPayment || !userPlans.amountCollected  || !userPlans.collectedBy) {
      throw new Error('Paid plan requires filling out all extra details');
    }
  } else {
    userPlans.modeOfPayment = null
    userPlans.amountCollected = null
    userPlans.discount = null
    userPlans.collectedBy = null
    userPlans.cgstPercent = null
    userPlans.gstPercent = null
    userPlans.totalGst = null
  }
});

module.exports = userPlans;
