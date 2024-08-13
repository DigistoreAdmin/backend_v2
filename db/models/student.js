"use strict";
const { DataTypes } = require("sequelize");
const sequelize = require("../../config/database");
const AppError = require("../../utils/appError");
const userPlans = require("./userplan");
const bcrypt = require("bcrypt");
const crypto = require("crypto");

const student = sequelize.define(
  "students",
  {
    collegeName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "collegeName cannot be null",
        },
        notEmpty: {
          msg: "collegeName cannot be empty",
        },
      },
    },
    collegeId: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "collegeId cannot be null",
        },
        notEmpty: {
          msg: "collegeId cannot be empty",
        },
      },
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "email cannot be null",
        },
        notEmpty: {
          msg: "email cannot be empty",
        },
      },
    },
    district: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "district cannot be null",
        },
        notEmpty: {
          msg: "district cannot be empty",
        },
      },
    },
    teamId: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "teamId cannot be null",
        },
        notEmpty: {
          msg: "teamId cannot be empty",
        },
      },
    },
    facultyName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "facultyName cannot be null",
        },
        notEmpty: {
          msg: "facultyName cannot be empty",
        },
      },
    },
    captainName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "captainName cannot be null",
        },
        notEmpty: {
          msg: "captainName cannot be empty",
        },
      },
    },
    mobileNumber: {
      type: DataTypes.BIGINT,
      allowNull: false,
      validate: {
        isInt: {
          msg: "Phone number must contain only numbers",
        },
        len: {
          args: [10, 10],
          msg: "Phone number must be exactly 10 digits",
        },
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "password cannot be null",
        },
        notEmpty: {
          msg: "password cannot be empty",
        },
        len: {
          args: [8],
          msg: "Password must be at least 8 characters",
        },
      },
    },
    onBoardedBy: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "admin",
    },
    onBoardedPersonId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    onBoardedPersonName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    userType: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "student",
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
    modelName: "students",
  }
);

module.exports = student;

student.beforeCreate(async (student) => {
  if (student.changed("password")) {
    console.log("12345");
    const hashedPassword = await bcrypt.hash(student.password, 8);
    student.password = hashedPassword;
  }
});
