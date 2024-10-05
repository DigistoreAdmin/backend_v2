"use strict";
const { Model, DataTypes } = require("sequelize");
const sequelize = require("../../config/database");

const medicalInsuranceData = (individualOrFamily) => {
  const allowNullIndividual =
    individualOrFamily === "individual" ? false : true;
  const allowNullFamily = individualOrFamily === "family" ? false : true;
  const medicalInsurance = sequelize.define(
    "medicalInsurance",
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
      workId: {
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
        validate: {
          isInt: {
            msg: "Phone number must be an integer",
          },
          len: {
            args: [10, 10],
            msg: "Phone number must be 10 digits",
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
            msg: "Invalid email format",
          },
          is: {
            args: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            msg: "Email address must be in a valid format (example@example.com)",
          },
        },
      },
      individualOrFamily: {
        allowNull: false,
        type: DataTypes.ENUM("individual", "family"),
      },
      dob: {
        type: DataTypes.DATE,
        allowNull: allowNullIndividual,
        validate: {
          notEmpty: {
            msg: "Date of birth is required",
          },
        },
      },
      sumInsuredLookingFor: {
        allowNull: allowNullIndividual,
        type: DataTypes.INTEGER,
      },
      preferredHospital: {
        allowNull: allowNullIndividual,
        type: DataTypes.STRING,
      },
      otherAddOn: {
        type: DataTypes.JSONB,
        allowNull: allowNullIndividual,
      },
      anyExistingDisease: {
        type: DataTypes.STRING,
        allowNull: allowNullIndividual,
      }, //family
      numberOfAdult: {
        type: DataTypes.INTEGER,
        allowNull: allowNullFamily,
      },
      numberOfKids: {
        type: DataTypes.INTEGER,
        allowNull: allowNullFamily,
      },
      familyDetails: {
        type: DataTypes.JSONB,
        allowNull: allowNullFamily,
        validate: {
          isValidFamily(memberDetails) {
            if (
              this.individualOrFamily === "family" &&
              (!memberDetails || !Array.isArray(memberDetails))
            ) {
              throw new Error("familyMembers must be an array of objects");
            }
          },
        },
      },
      //documents of nominee
      aadharFront: {
        type: DataTypes.STRING,
        allowNull: allowNullIndividual,
      },
      aadharBack: {
        type: DataTypes.STRING,
        allowNull: allowNullIndividual,
      },
      pan: {
        type: DataTypes.STRING,
        allowNull: allowNullIndividual,
      },
      bank: {
        allowNull: allowNullIndividual,
        type: DataTypes.STRING,
      },
      height: {
        type: DataTypes.FLOAT,
        allowNull: allowNullIndividual,
      },
      weight: {
        type: DataTypes.FLOAT,
        allowNull: allowNullIndividual,
      },
      assignedId: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      status: {
        allowNull: false,
        type: DataTypes.ENUM("inQueue", "inProgress", "completed"),
        defaultValue: "inQueue",
      },
      assignedOn: {
        allowNull: false,
        type: DataTypes.DATE,
      },
      completedOn: {
        type: DataTypes.DATE,
        allowNull: false,
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
      modelName: "medicalInsurance",
    }
  );
  return medicalInsurance;
};

module.exports = medicalInsuranceData;
