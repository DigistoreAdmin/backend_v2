'use strict';
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

module.exports = sequelize.define(
  'fssaiRegistrations',
  {
    uniqueId: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Unique ID cannot be null',
        },
        notEmpty: {
          msg: 'Unique ID cannot be empty',
        },
      },
    },
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    customerName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Customer name cannot be null',
        },
        notEmpty: {
          msg: 'Customer name cannot be empty',
        },
      },
    },
    mobileNumber: {
      type: DataTypes.BIGINT,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Mobile number cannot be null',
        },
        notEmpty: {
          msg: 'Mobile number cannot be empty',
        },
        isNumeric: {
          msg: 'Mobile number must contain only numbers',
        },
        len: {
          args: [10, 15],
          msg: 'Mobile number must be between 10 and 15 digits',
        },
      },
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Email cannot be null',
        },
        notEmpty: {
          msg: 'Email cannot be empty',
        },
        isEmail: {
          msg: 'Invalid email address',
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
          msg: 'Business name cannot be null',
        },
        notEmpty: {
          msg: 'Business name cannot be empty',
        },
      },
    },
    businessAddressLine1: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Business address line 1 cannot be null',
        },
        notEmpty: {
          msg: 'Business address line 1 cannot be empty',
        },
      },
    },
    businessAddressLine2: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    pincode: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Pincode cannot be null',
        },
        notEmpty: {
          msg: 'Pincode cannot be empty',
        },
        isNumeric: {
          msg: 'Pincode must be numeric',
        },
        len: {
          args: [6, 6],
          msg: 'Pincode must be exactly 6 digits',
        },
      },
    },
    productsOrItems: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    circleOfTheUnit: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    aadhaarFront: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isUrl: {
          msg: 'Aadhaar front image must be a valid URL',
        },
      },
    },
    aadhaarBack: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isUrl: {
          msg: 'Aadhaar back image must be a valid URL',
        },
      },
    },
    panCard: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isUrl: {
          msg: 'PAN card image must be a valid URL',
        },
      },
    },
    photo: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isUrl: {
          msg: 'Photo must be a valid URL',
        },
      },
    },
    waterTestPaper: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isUrl: {
          msg: 'Water test paper must be a valid URL',
        },
      },
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    deletedAt: {
      type: DataTypes.DATE,
    },
  },
  {
    paranoid: true,
    freezeTableName: true,
    modelName: 'fssaiRegistrations',
  }
);

