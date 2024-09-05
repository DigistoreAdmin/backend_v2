"use strict";
const { Model, DataTypes } = require("sequelize");
const sequelize = require("../../config/database");

module.exports = sequelize.define(
  "packingLicences",
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
    phoneNumber: {
      type: DataTypes.BIGINT,
      allowNull: false,
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
    businessName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Business name cannot be null",
        },
        notEmpty: {
          msg: "Business name cannot be empty",
        },
      },
    },
    businessAddressLine1: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Business address line 1 cannot be null",
        },
        notEmpty: {
          msg: "Business address line 1 cannot be empty",
        },
      },
    },
    businessAddressLine2: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Business address line 2 cannot be null",
        },
        notEmpty: {
          msg: "Business address line 2 cannot be empty",
        },
      },
    },
    pinCode: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Pin code cannot be null",
        },
        notEmpty: {
          msg: "Pin code cannot be empty",
        },
        isNumeric: {
          msg: "Pin code must contain only numbers",
        },
        len: {
          args: [6, 6],
          msg: "Pin code must be exactly 6 digits",
        },
      },
    },
    listOfProducts: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    aadhaarFront: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isUrl: {
          msg: "Upload URL must be a valid URL",
        },
      },
    },
    aadhaarBack: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isUrl: {
          msg: "Upload URL must be a valid URL",
        },
      },
    },
    panCard: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isUrl: {
          msg: "Upload URL must be a valid URL",
        },
      },
    },
    fassaiRegistrationCertificate: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isUrl: {
          msg: "Upload URL must be a valid URL",
        },
      },
    },
    buildingTaxReceipt: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isUrl: {
          msg: "Upload URL must be a valid URL",
        },
      },
    },
    rentAgreement: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isUrl: {
          msg: "Upload URL must be a valid URL",
        },
      },
    },
    ownershipCertificate: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isUrl: {
          msg: "Upload URL must be a valid URL",
        },
      },
    },
    selfDeclaration: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isUrl: {
          msg: "Upload URL must be a valid URL",
        },
      },
    },
    photo: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isUrl: {
          msg: "Upload URL must be a valid URL",
        },
      },
    },
    signature: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isUrl: {
          msg: "Upload URL must be a valid URL",
        },
      },
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
    modelName: "packingLicences",
  }
);
