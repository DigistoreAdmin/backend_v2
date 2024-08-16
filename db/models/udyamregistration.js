"use strict";
const { Model,DataTypes } = require("sequelize");
const sequelize=require('../../config/database')
module.exports = sequelize.define(
  "udyamRegistrations",
  {
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
      }
    },
    addressLine1: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "address line cannot be null",
        },
        notEmpty: {
          msg: "address line cannot be empty",
        },
      }
    },
    addressLine2: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    pinCode: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: {
          msg: "pincode cannot be null",
        },
        notEmpty: {
          msg: "pincode cannot be empty",
        },
      }
    },
    shopLongitude: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "shop longitude cannot be null",
        },
        notEmpty: {
          msg: "shop logitude cannot be empty",
        },
      }
    },
    shopLatitude: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "shop latitude cannot be null",
        },
        notEmpty: {
          msg: "shop latitude cannot be empty",
        },
      }
    },
    religionWithCaste: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "religion with caste cannot be null",
        },
        notEmpty: {
          msg: "religion with caste cannot be empty",
        },
      }
    },
    totalNumberOfEmployees: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: {
          msg: "total number of employees cannot be null",
        },
        notEmpty: {
          msg: "total number of employees cannot be empty",
        },
      }
    },
    totalMen: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: {
          msg: "total men cannot be null",
        },
        notEmpty: {
          msg: "total men cannot be empty",
        },
      }
    },
    totalWomen: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: {
          msg: "total women cannot be null",
        },
        notEmpty: {
          msg: "total women cannot be empty",
        },
      }
    },
    firmRegistrationDate: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "date of registration cannot be null",
        },
        notEmpty: {
          msg: "date of registration cannot be empty",
        },
      }
    },
    firmCommencementDate: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "date od commencement cannot be null",
        },
        notEmpty: {
          msg: "date od commencement cannot be empty",
        },
      }
    },
    businessType: {
      type: DataTypes.ENUM("proprietary","partnership","company"),  
      allowNull: false,
    },
    annualTurnOver: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: {
          msg: "annual turnover cannot be null",
        },
        notEmpty: {
          msg: "annual turnover cannot be empty",
        },
      }
    },
    aadhaarFront: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        isUrl: {
          msg: 'Aadhaar front image must be a valid URL',
        },
      },
    },
    aadhaarBack: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        isUrl: {
          msg: 'Aadhaar back image must be a valid URL',
        },
      },
    },
    pancard: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        isUrl: {
          msg: 'pan card image must be a valid URL',
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
    modelName: "udyamRegistrations",
  }
);
