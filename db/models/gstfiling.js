'use strict';
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

module.exports = sequelize.define(
  'gstFilings',
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
    gstNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'GST number cannot be null',
        },
        notEmpty: {
          msg: 'GST number cannot be empty',
        },
      },
    },
    gstUsername: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'GST username cannot be null',
        },
        notEmpty: {
          msg: 'GST username cannot be empty',
        },
      },
    },
    gstPassword: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'GST password cannot be null',
        },
        notEmpty: {
          msg: 'GST password cannot be empty',
        },
      },
    },
    bills: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        isUrl: {
          msg: 'Bills must be a valid URL',
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
    modelName: 'gstFilings',
  }
);
