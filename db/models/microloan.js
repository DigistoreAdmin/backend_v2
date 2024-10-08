"use strict";
const { DataTypes } = require("sequelize");
const sequelize = require("../../config/database");

const microLoans = sequelize.define(
  "microLoans",
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
    address: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    pinCode: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    income: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    loanAmount: {
      type: DataTypes.BIGINT,
      allowNull: false,
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
      type: DataTypes.JSONB,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Bank statement cannot be empty",
        },
      },
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
      type: DataTypes.BIGINT,
      allowNull: true,
    },
    commissionCredit: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    assignedId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: {
        isInt: {
          msg: "Assigned ID must be an integer",
        },
      },
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
      type: DataTypes.ENUM("inQueue", "inProgress", "Completed"),
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
    modelName: "microLoans",
  }
);

module.exports = microLoans;
