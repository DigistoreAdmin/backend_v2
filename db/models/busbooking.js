'use strict';
const { Model, Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

module.exports = sequelize.define(
  'busBookings',
  {
    uniqueId: {
      type: DataTypes.STRING,
      allowNull: false,
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
    phoneNumber: {
      type: DataTypes.BIGINT,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Phone number cannot be null',
        },
        notEmpty: {
          msg: 'Phone number cannot be empty',
        },
        isInt: {
          msg: 'Phone number must contain only numbers',
        },
        len: {
          args: [10, 10],
          msg: 'Phone number must be exactly 10 digits',
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
          msg: 'Email address must be in a valid format (example@example.com)',
        },
      },
    },
    boardingStation: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Boarding station cannot be null',
        },
        notEmpty: {
          msg: 'Boarding station cannot be empty',
        },
      },
    },
    destinationStation: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Destination station cannot be null',
        },
        notEmpty: {
          msg: 'Destination station cannot be empty',
        },
      },
    },
    startDate: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Start date cannot be null',
        },
        isDate: {
          msg: 'Start date must be a valid date',
        },
      },
    },
    preference: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    passengerDetails: {
      type: DataTypes.JSONB,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Passenger details cannot be null',
        },
        isValidPassengerDetails(value) {
          if (!Array.isArray(value) || value.length === 0) {
            throw new Error('Passenger details must be a non-empty array');
          }
          value.forEach((passenger) => {
            if (!passenger.name || !passenger.age || !passenger.gender) {
              throw new Error('Each passenger must have a name, age, and gender');
            }
          });
        },
      },
    },
    assignedId: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM("inQueue", "inProgress", "completed"),
      allowNull: false,
      defaultValue: "inQueue"
    },
    assignedOn: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    completedOn: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    workId: {
      type: DataTypes.STRING,
      allowNull: true
    },
    ticket: {
      type: DataTypes.STRING,
      allowNull: true
    },
    amount: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    serviceCharge: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    commissionToFranchise: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    commissionToHO: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    totalAmount: {
      type: DataTypes.INTEGER,
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
    },
  },
  {
    paranoid: true,
    freezeTableName: true,
    modelName: 'busBookings',
  }
);