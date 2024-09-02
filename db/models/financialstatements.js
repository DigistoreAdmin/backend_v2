"use strict";
const { Model, DataTypes } = require("sequelize");
const sequelize=require('../../config/database')
module.exports = sequelize.define(
  "financialStatements",{
    id:{
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    uniqueId:{
      type:DataTypes.STRING,
      allowNull: false,
    },
    customerName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "customer name cannot be null",
        },
        notEmpty: {
          msg: "customer name cannot be empty",
        },
      },
    },
    businessName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "business name cannot be null",
        },
        notEmpty: {
          msg: "business name cannot be empty",
        },
      },
    },
    businessType: {
      type: DataTypes.ENUM("proprietary","partnership","company"),  
      allowNull: false,
    },
    mobileNumber: {
      type: DataTypes.BIGINT,
      allowNull: false,
            validate: {
                isInt: {
                    msg: 'Phone number must contain only numbers',
                },
                len: {
                    args: [10, 10],
                    msg: 'Phone number must be exactly 10 digits',
                },
            }
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
                notNull: {
                    msg: 'email cannot be null',
                },
                notEmpty: {
                    msg: 'email cannot be empty',
                },
                isEmail: {
                    msg: 'Invalid email format',
                },
                is: {
                  args: /^[^\s@]+@[^\s@]+.[^\s@]+$/,
                  msg: 'Email address must be in a valid format (example@example.com)',
              }
            }
    },
    gstUsername:{
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "gst username cannot be null",
        },
        notEmpty: {
          msg: "gst username cannot be empty",
        },
      },
    },
    gstPassword:{
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "gst password cannot be null",
        },
        notEmpty: {
          msg: "gst password cannot be empty",
        },
      },
    },
    cashbookAndOtherAccounts: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isUrl: {
          msg: 'cashbook and other documents file must be a valid URL',
        },
      },
    },
    creditorsAndDebitorsList: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isUrl: {
          msg: 'creditors and debitors list file must be a valid URL',
        },
      },
    },
    bankStatements: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isUrl: {
          msg: 'bank statements file must be a valid URL',
        },
      },
    },
    gstStatement: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isUrl: {
          msg: 'gst statement file must be a valid URL',
        },
      },
    },
    stockDetails: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isUrl: {
          msg: 'gst statement file must be a valid URL',
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
    modelName: "financialStatements",
  }
)