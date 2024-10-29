"use strict";
const { DataTypes } = require("sequelize");
const sequelize = require("../../config/database");

const microLoansShop = sequelize.define(
  "microLoansShop",
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
    workId: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Work ID cannot be null",
        },
        notEmpty: {
          msg: "Work ID cannot be empty",
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
          msg: "Mobile number must be an integer",
        },
        len: {
          args: [10, 10],
          msg: "Mobile number must be 10 digits",
        },
      },
    },
    shopName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Shop  name cannot be empty",
        },
      },
    },
    shopType: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Shop  type cannot be empty",
        },
      },
    },
    loanAmount: {
      type: DataTypes.BIGINT,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Loan Amount cannot be empty",
        },
      },
    },
    aadhaarFront: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Aadhaar front cannot be empty",
        },
      },
    },
    aadhaarBack: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Aadhaar back cannot be empty",
        },
      },
    },
    pan: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "PAN cannot be empty",
        },
      },
    },
    bankStatement: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Bank statement cannot be empty",
        },
      },
    },
    twoYearLicence: {
      type: DataTypes.JSONB,
      allowNull: false,
    },
    shopPhoto: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    otherDocuments: {
      type: DataTypes.JSONB,
      allowNull: false,
    },
    //staff
    emiAmount: {
      type: DataTypes.BIGINT,
      allowNull: true,
    },
    staffStatus: {
      type: DataTypes.JSONB,
      allowNull: true,
    },
    collectionPoint: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    collectionDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    collectionMethod: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    tenure: {
      type: DataTypes.BIGINT,
      allowNull: true,
    },
    loanProcessedBy: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    commissionDetails: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    commissionCredit: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    assignedId: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    assignedOn: {
      type: DataTypes.DATE,
      allowNull: true,
      validate: {
        isDate: {
          msg: "Assigned On must be a valid date",
        },
      },
    },
    completedOn: {
      type: DataTypes.DATE,
      allowNull: true,
      validate: {
        isDate: {
          msg: "Completed On must be a valid date",
        },
      },
    },
    status: {
      type: DataTypes.ENUM("inQueue", "inProgress", "completed","rejected"),
      allowNull: true,
      defaultValue: "inQueue",
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
    modelName: "microLoansShop",
  }
);

module.exports = microLoansShop;
