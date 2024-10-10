'use strict';
const{ DataTypes } = require('sequelize')
const sequelize = require('../../config/database')

const contact = sequelize.define(
    'contacts',
    {
        id: {
          allowNull:false,
          autoIncrement: true,
          primaryKey: true,
          type: DataTypes.INTEGER,
        },
        fullName: {
          type: DataTypes.STRING,
          allowNull: false,
          validate:{
            notNull: {
                msg: 'Full Name cannot be null',
            },
            notEmpty: {
                msg: 'Full Name cannot be empty',
            }
          }
        },
        email:  {
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
              msg: 'Email address must be in a valid format (example@example.com)',
            },
          },
        },
        phoneNumber: {
          type: DataTypes.STRING,
          allowNull: false,
          validate: {
            notNull: {
                msg: 'Phone number cannot be null',
            },
            notEmpty: {
                msg: 'Phone number cannot be empty',
            },
            isInt: {
                msg: 'Phone number must contain only numbers'
            },
            len: {
                args: [10,10],
                msg: 'Phone number must be exactly 10 digits'
            }
          }
        },
        subject: {
          type: DataTypes.STRING,
          allowNull: false,
          validate: {
            notNull: {
                msg: 'Subject cannot be null',
            },
            notEmpty: {
                msg: 'Subject cannot be empty',
            }
          }
        },
        enquiryMessage: {
          type: DataTypes.TEXT,
          allowNull: false,
          validate: {
            notNull: {
                msg: 'Enquiry message cannot be null',
            },
            notEmpty: {
                msg: 'Enquiry message cannot be empty',
            }
          }
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
        modelName: 'contacts'
      }
);

module.exports = contact