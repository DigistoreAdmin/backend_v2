"use strict";
const { Model, DataTypes } = require("sequelize");
const sequelize = require("../../config/database");
const bcrypt = require("bcrypt");

const defineStaffsDetails = (
  employmentType,
  isTrainingRequired,
  laptop,
  idCard,
  sim,
  phone,
  vistingCard,
  posterOrBroucher,
  other
) => {
  const firstPart = "DSP";
  const type = employmentType === "fieldExecutive" ? false : true;
  const laptopStatus = laptop !== "true";
  const idCardStatus = idCard !== "true";
  const simStatus = sim !== "true";
  const phoneStatus = phone !== "true";
  const vistingCardStatus = vistingCard !== "true";
  const posterOrBroucherStatus = posterOrBroucher !== "true";
  const otherStatus = other !== "true";
  const training = isTrainingRequired === "true" ? false : true;
  const staffDetails = sequelize.define(
    "staffs",
    {
      employeeId: {
        type: DataTypes.STRING,
        primaryKey: true,
      },
      userType: {
        type: DataTypes.ENUM("staff"),
        defaultValue: "staff",
        allowNull: false,
        validate: {
          notNull: {
            msg: "userType cannot be null",
          },
          notEmpty: {
            msg: "userType cannot be empty",
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
      firstName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "firstName name cannot be null",
          },
          notEmpty: {
            msg: "firstName name cannot be empty",
          },
        },
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "lastName name cannot be null",
          },
          notEmpty: {
            msg: "lastName name cannot be empty",
          },
        },
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
            msg: "Invalid email address",
          },
          is: {
            args: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            msg: "Email address must be in a valid format (example@example.com)",
          },
        },
      },
      phoneNumber: {
        type: DataTypes.BIGINT,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Phone number cannot be null",
          },
          notEmpty: {
            msg: "Phone number cannot be empty",
          },
          isInt: {
            msg: "Phone number must contain only numbers",
          },
          len: {
            args: [10, 10],
            msg: "Phone number must be exactly 10 digits",
          },
        },
      },
      dateOfBirth: {
        type: DataTypes.DATE,
        allowNull: false,
        validate: {
          notNull: {
            msg: "date of birth cannot be null",
          },
          notEmpty: {
            msg: "date of birth cannot be empty",
          },
          isDate: {
            msg: "date of birth must be a valid date",
          },
        },
      },

      gender: {
        type: DataTypes.ENUM("male", "female", "other"),
        allowNull: false,
      },
      employment: {
        type: DataTypes.ENUM("trainee", "fullTime", "partTime"),
        allowNull: false,
      },
      employmentType: {
        type: DataTypes.ENUM("fieldExecutive", "officeExecutive"),
        allowNull: false,
      },
      addressLine1: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "AddressLine1 name cannot be null",
          },
          notEmpty: {
            msg: "AddressLine1 name cannot be empty",
          },
        },
      },
      addressLine2: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "AddressLine2 name cannot be null",
          },
          notEmpty: {
            msg: "AddressLine2 name cannot be empty",
          },
        },
      },
      emergencyContact: {
        type: DataTypes.BIGINT,
        allowNull: false,
        validate: {
          notNull: {
            msg: "emergencyContact cannot be null",
          },
          notEmpty: {
            msg: "emergencyContact cannot be empty",
          },
          isInt: {
            msg: "emergencyContact must contain only numbers",
          },
          len: {
            args: [10, 10],
            msg: "emergencyContact must be exactly 10 digits",
          },
        },
      },
      districtOfOperation: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: type,
      },
      reportingManager: {
        type: DataTypes.STRING,
        allowNull: type,
      },
      dateOfJoin: {
        type: DataTypes.DATE,
        allowNull: false,
        validate: {
          notNull: {
            msg: "date of join cannot be null",
          },
          notEmpty: {
            msg: "date of join cannot be empty",
          },
          isDate: {
            msg: "date of join must be a valid date",
          },
        },
      },
      isTrainingRequired: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
      totalTrainingDays: {
        type: DataTypes.INTEGER,
        allowNull: training,
      },
      employmentStartDate: {
        type: DataTypes.DATE,
      },
      city: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "city cannot be null",
          },
          notEmpty: {
            msg: "city cannot be empty",
          },
        },
      },
      district: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "district name cannot be null",
          },
          notEmpty: {
            msg: "district name cannot be empty",
          },
        },
      },
      state: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "state cannot be null",
          },
          notEmpty: {
            msg: "state cannot be empty",
          },
        },
      },
      pinCode: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          isNumeric: {
            msg: "Pin code must be numeric",
          },
          len: {
            args: [6, 6],
            msg: "Pin code must be exactly 6 digits long",
          },
          notNull: {
            msg: "Pin code cannot be null",
          },
          notEmpty: {
            msg: "Pin code cannot be empty",
          },
        },
      },
      bank: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "bank cannot be null",
          },
          notEmpty: {
            msg: "bank cannot be empty",
          },
        },
      },
      accountNumber: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Account Number cannot be null",
          },
          notEmpty: {
            msg: "Account Number cannot be empty",
          },
        },
      },

      branchName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Branch name cannot be null",
          },
          notEmpty: {
            msg: "Branch name cannot be empty",
          },
        },
      },
      ifscCode: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "ifscCode cannot be null",
          },
          notEmpty: {
            msg: "ifscCode cannot be empty",
          },
        },
      },
      accountName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "AccountName cannot be null",
          },
          notEmpty: {
            msg: "AccountName cannot be empty",
          },
        },
      },
      bloodGroup: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "bloodGroup cannot be null",
          },
          notEmpty: {
            msg: "bloodGroup cannot be empty",
          },
        },
      },
      laptop: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
      idCard: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
      sim: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
      phone: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
      vistingCard: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
      posterOrBroucher: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
      other: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
      laptopDetails: {
        type: DataTypes.STRING,
        allowNull: laptopStatus,
      },
      idCardDetails: {
        type: DataTypes.STRING,
        allowNull: idCardStatus,
      },
      phoneDetails: {
        type: DataTypes.STRING,
        allowNull: phoneStatus,
      },
      simDetails: {
        type: DataTypes.STRING,
        allowNull: simStatus,
      },
      vistingCardDetails: {
        type: DataTypes.STRING,
        allowNull: vistingCardStatus,
      },
      posterOrBroucherDetails: {
        type: DataTypes.STRING,
        allowNull: posterOrBroucherStatus,
      },
      otherDetails: {
        type: DataTypes.STRING,
        allowNull: otherStatus,
      },
      remarks: {
        type: DataTypes.STRING,
        allowNull: true,
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
      modelName: "staffs",
      hooks: {
        beforeCreate: async (staff, options) => {
          const lastEmployee = await staffDetails.findOne({
            order: [["employeeId", "DESC"]],
          });

          const employmentCodes = {
            trainee: "03",
            fullTime: "01",
            partTime: "02",
          };

          const employmentTypeCodes = {
            fieldExecutive: "01",
            officeExecutive: "02",
          };

          let newId;
          if (lastEmployee) {
            const lastId = lastEmployee.employeeId;
            const numberPart = parseInt(lastId.slice(-3), 10) + 1;
            newId = `${firstPart}${employmentCodes[staff.employment]}${
              employmentTypeCodes[staff.employmentType]
            }${String(numberPart).padStart(3, "0")}`;
          } else {
            newId = `${firstPart}${employmentCodes[staff.employment]}${
              employmentTypeCodes[staff.employmentType]
            }001`;
          }

          staff.employeeId = newId;
        },
      },
    }
  );
  return staffDetails;
};

module.exports = defineStaffsDetails;
