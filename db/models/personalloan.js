"use strict";
const {Model,DataTypes}=require("sequelize");
const sequelize = require("../../config/database");

const definePersonalLoan = (salariedOrBusiness,cibil) => {
  const isSalaried = salariedOrBusiness === "salaried" ? false : true;
  const isBusiness = salariedOrBusiness === "business" ? false : true;
  const cibilNullvalue=cibil==="approved" ? false : true;
  const cibilAcknowledgment=cibil==="noCibil" ? false : true;

  const personalLoan = sequelize.define(
    "personalLoan",
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      workId: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          notNull: {
            msg: "Work ID cannot be null",
          },
          notEmpty: {
            msg: "Work ID cannot be empty",
          },
        },
      },
      uniqueId: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Unique ID cannot be null",
          },
          notEmpty: {
            msg: "Unique ID cannot be empty",
          },
        },
      },
      customerName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Customer name cannot be null",
          },
          notEmpty: {
            msg: "Customer name cannot be empty",
          },
        },
      },
      mobileNumber: {
        type: DataTypes.BIGINT,
        allowNull: false,
        validate: {
          isInt: {
            msg: "Mobile number must contain only numbers",
          },
          len: {
            args: [10, 10],
            msg: "Mobile number must be exactly 10 digits",
          },
        },
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Email cannot be null",
          },
          notEmpty: {
            msg: "Email cannot be empty",
          },
          isEmail: {
            msg: "Invalid email format",
          },
          is: {
            args: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            msg: "Email address must be in a valid format (example@example.com)",
          },
        },
      },
      cibil:{
        type: DataTypes.ENUM("approved","noCibil"),
        allowNull: false,
      },
      cibilScore: {
        type: DataTypes.INTEGER,
        allowNull: cibilNullvalue,
      },
      cibilReport: {
        type: DataTypes.STRING,
        allowNull: cibilNullvalue,
      },
      cibilAcknowledgement:{
        type: DataTypes.STRING,
        allowNull: cibilAcknowledgment,
      },
      loanAmount: {
        type: DataTypes.BIGINT,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Loan amount cannot be null",
          },
          notEmpty: {
            msg: "Loan amount cannot be empty",
          },
          isNumeric: {
            msg: "Loan amount must be numeric",
          },
        },
      },
      sourceOfIncome: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Source of income cannot be null",
          },
          notEmpty: {
            msg: "Source of income cannot be empty",
          },
          isUrl: {
            msg: "cashbook and other documents file must be a valid URL",
          },
        },
      },
      salariedOrBusiness: {
        type: DataTypes.ENUM("salaried", "business"),
        allowNull: false,
      },
      salarySlip: {
        type: DataTypes.STRING,
        allowNull: isSalaried,
      },
      bankStatement: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Bank statement cannot be null",
          },
          notEmpty: {
            msg: "Bank statement cannot be empty",
          },
          isUrl: {
            msg: "Bank statement must be a valid URL",
          },
        },
      },
      itr: {
        type: DataTypes.STRING,
        allowNull: isBusiness,
      },
      rentAgreement: {
        type: DataTypes.STRING,
        allowNull: isBusiness,
      },
      panchayathLicence: {
        type: DataTypes.STRING,
        allowNull: isBusiness,
      },
      cancelledCheque: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      photo: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      assignedId:{
        type: DataTypes.STRING,
        allowNull:true
      },
      status:{
        allowNull:false,
        type: DataTypes.ENUM("inQueue","inProgress","completed","rejected"),  
        defaultValue:"inQueue"
      },
      assignedOn:{
        allowNull:true,
        type:DataTypes.DATE,
      },
      completedOn:{
        type:DataTypes.DATE,
        allowNull:true
      },
      loanStatus: {
        type: DataTypes.JSONB,
        allowNull: true
      },
      rejectReason: {
        type: DataTypes.STRING,
        allowNull: true
      },
      bankDetails: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      loanGivenByBank: {
        type: DataTypes.BIGINT,
        allowNull: true,
      },
      doneBy: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      serviceCharge: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      commissionToFranchise: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      commissionToHO: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      otherPayments: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      otherDocumentsByStaff: {
        type: DataTypes.STRING,
        allowNull: true
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
        allowNull: true,
      },
    },
    {
      paranoid: true,
      freezeTableName: true,
      modelName: "personalLoan",
    }
  );
  return personalLoan
};

module.exports = definePersonalLoan