"use strict";
const { Model, DataTypes } = require("sequelize");
const sequelize = require("../../config/database");
const bcrypt = require("bcrypt");

const defineStaffsDetails = (employmentType, isTrainingRequired) => {
  const firstPart = "DSP";
  const type = employmentType === "fieldExecutive" ? false : true;
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
      accountHolderName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "AccountHolderName cannot be null",
          },
          notEmpty: {
            msg: "AccountHolderName cannot be empty",
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
        type: DataTypes.STRING,
        allowNull: null,
      },
      idCard: {
        type: DataTypes.STRING,
        allowNull: null,
      },
      sim: {
        type: DataTypes.STRING,
        allowNull: null,
      },
      phone: {
        type: DataTypes.STRING,
        allowNull: null,
      },
      vistingCard: {
        type: DataTypes.STRING,
        allowNull: null,
      },
      posterOrBroucher: {
        type: DataTypes.STRING,
        allowNull: null,
      },
      other: {
        type: DataTypes.STRING,
        allowNull: type,
      },
      remarks: {
        type: DataTypes.STRING,
        allowNull: type,
      },
      blocked:{
        type: DataTypes.ENUM("blocked","unBlocked"),
        allowNull: false,
        defaultValue:"unBlocked"
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
            where: {
              district: staff.district,
              employment: staff.employment,
              employmentType: staff.employmentType,
            },
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
