'use strict';
const { Model, Sequelize, DataTypes } = require('sequelize');
const bcrypt = require('bcrypt');

const sequelize = require('../../config/database');
const AppError = require('../../utils/appError');
const project = require('./project');
const Distributor = require('./distributor');

const user = sequelize.define(
    'user',
    {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER,
        },
        userType: {
            type: DataTypes.ENUM('admin','distributor','franchise','student'),
            allowNull: false,
            validate: {
                notNull: {
                    msg: 'userType cannot be null',
                },
                notEmpty: {
                    msg: 'userType cannot be empty',
                },
            },
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
                    msg: 'Invalid email id',
                },
            },
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notNull: {
                    msg: 'password cannot be null',
                },
                notEmpty: {
                    msg: 'password cannot be empty',
                },
                len: {
                    args: [8],
                    msg: "Password must be at least 8 characters",
                  },
            },
        },
        phoneNumber: {
            type: DataTypes.BIGINT,
            allowNull: true,
            validate: {
                isInt: {
                    msg: 'Phone number must contain only numbers',
                },
                len: {
                    args: [10, 10],
                    msg: 'Phone number must be exactly 10 digits',
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
        modelName: 'user',
    }
);

module.exports = user;


user.beforeCreate(async (user) => {
    if (user.changed('password')) {
        console.log("12345");
        const hashedPassword = await bcrypt.hash(user.password, 8);
        user.password = hashedPassword;
      }

    //   if (franchise.changed('aadhaarNumber')) {
    //     console.log("Hashing aadhaarNumber");
    //     franchise.aadhaarNumber = await bcrypt.hash(franchise.aadhaarNumber, 8);
    // }

    // if (franchise.changed('panNumber')) {
    //     console.log("Hashing panNumber");
    //     franchise.panNumber = await bcrypt.hash(franchise.panNumber, 8);
    // }
});

user.prototype.isPasswordMatch = async function(password) {
    try {
      return await bcrypt.compare(password, this.password);
    } catch (error) {
      console.error("Error comparing passwords:", error);
      throw new Error("Failed to compare passwords");
    }
  };
