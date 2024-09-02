"use strict";
const { DataTypes } = require("sequelize");
const sequelize = require("../../config/database");

const createCibilReport = (purpose) => {
  const allowNullProp = purpose === "applyForCivilReport" ? false : true;
  const allowNullPro = purpose === "alreadyHaveCibilReport" ? false : true;

  const cibilReport = sequelize.define(
    "cibilReport",
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
          notNull: {
            msg: "Mobile number cannot be null",
          },
          notEmpty: {
            msg: "Mobile number cannot be empty",
          },
          isInt: {
            msg: "Mobile number must contain only numbers",
          },
          len: {
            args: [10, 10],
            msg: "Phone number must be exactly 10 digits",
          },
        },
      },
      emailId: {
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
            msg: "Invalid email address",
          },
          is: {
            args: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            msg: "Email address must be in a valid format (example@example.com)",
          },
        },
      },
      purpose: {
        allowNull: true,
        type: DataTypes.ENUM("applyForCivilReport", "alreadyHaveCibilReport"),
      },
      cibilScore: {
        type: DataTypes.BIGINT,
        allowNull: allowNullPro,
      },
      cibilReport: {
        type: DataTypes.STRING,
        allowNull: allowNullPro,
      },
      aadhaarFront: {
        type: DataTypes.STRING,
        allowNull: allowNullProp,
        validate: {
          isUrl: {
            msg: "Upload URL must be a valid URL",
          },
        },
      },
      aadhaarBack: {
        type: DataTypes.STRING,
        allowNull: allowNullProp,
        validate: {
          isUrl: {
            msg: "Upload URL must be a valid URL",
          },
        },
      },
      panCardFront: {
        type: DataTypes.STRING,
        allowNull: allowNullProp,
        validate: {
          isUrl: {
            msg: "Upload URL must be a valid URL",
          },
        },
      },
      panCardBack: {
        type: DataTypes.STRING,
        allowNull: allowNullProp,
        validate: {
          isUrl: {
            msg: "Upload URL must be a valid URL",
          },
        },
      },
      status: {
        allowNull: true,
        type: DataTypes.ENUM("approve", "pending", "reject", "process"),
      },
      assignedId: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      assignedOn: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      completedOn: {
        type: DataTypes.DATE,
        allowNull: true,
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
      modelName: "cibilReport",
    }
  );

  return cibilReport;
};

module.exports = createCibilReport;
