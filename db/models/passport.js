"use strict";
const { Model, DataTypes } = require("sequelize");
const sequelize = require("../../config/database");

const definePassportDetails = (maritalStatus, passportRenewal) => {
  const isMarried = maritalStatus === "yes" ? false : true;
  const isRenewal = passportRenewal === "true" ? false : true;
  const passportDetails = sequelize.define(
    "passport",
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
      status: {
        type: DataTypes.ENUM("inQueue", "inProgress", "completed"),
        defaultValue: "inQueue",
      },
      assignedId: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      assignedOn: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      completedOn: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      oldPassportNumber: {
        type: DataTypes.STRING,
        allowNull: isRenewal,
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
      mobileNumber: {
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
      customerEmail: {
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
      educationQualification: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Education qualification cannot be null",
          },
          notEmpty: {
            msg: "Education qualification cannot be empty",
          },
        },
      },
      personalAddress: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Personal address cannot be null",
          },
          notEmpty: {
            msg: "Personal address cannot be empty",
          },
        },
      },
      maritalStatus: {
        type: DataTypes.ENUM("yes", "no"),
        allowNull: false,
        validate: {
          notNull: {
            msg: "Marital status cannot be null",
          },
          notEmpty: {
            msg: "Marital status cannot be empty",
          },
        },
      },
      spouseName: {
        type: DataTypes.STRING,
        allowNull: isMarried,
      },
      employmentType: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Employment type cannot be null",
          },
          notEmpty: {
            msg: "Employment type cannot be empty",
          },
        },
      },
      birthPlace: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Birth place cannot be null",
          },
          notEmpty: {
            msg: "Birth place cannot be empty",
          },
        },
      },
      identificationMark1: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Identification mark 1 cannot be null",
          },
          notEmpty: {
            msg: "Identification mark 1 cannot be empty",
          },
        },
      },
      identificationMark2: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Identification mark 2 cannot be null",
          },
          notEmpty: {
            msg: "Identification mark 2 cannot be empty",
          },
        },
      },
      policeStation: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Police station cannot be null",
          },
          notEmpty: {
            msg: "Police station cannot be empty",
          },
        },
      },
      village: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Village cannot be null",
          },
          notEmpty: {
            msg: "Village cannot be empty",
          },
        },
      },
      emergencyContactPerson: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Emergency contact person cannot be null",
          },
          notEmpty: {
            msg: "Emergency contact person cannot be empty",
          },
        },
      },
      emergencyContactNumber: {
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
      emergencyContactAddress: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Emergency contact address cannot be null",
          },
          notEmpty: {
            msg: "Emergency contact address cannot be empty",
          },
        },
      },
      passportOfficePreference: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Passport office preference cannot be null",
          },
          notEmpty: {
            msg: "Passport office preference cannot be empty",
          },
        },
      },
      appointmentDatePreference1: {
        type: DataTypes.DATE,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Appointment date preference cannot be null",
          },
          notEmpty: {
            msg: "Appointment date preference cannot be empty",
          },
          isDate: {
            msg: "Appointment date preference must be a valid date",
          },
        },
      },
      appointmentDatePreference2: {
        type: DataTypes.DATE,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Appointment date preference cannot be null",
          },
          notEmpty: {
            msg: "Appointment date preference cannot be empty",
          },
          isDate: {
            msg: "Appointment date preference must be a valid date",
          },
        },
      },
      appointmentDatePreference3: {
        type: DataTypes.DATE,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Appointment date preference cannot be null",
          },
          notEmpty: {
            msg: "Appointment date preference cannot be empty",
          },
          isDate: {
            msg: "Appointment date preference must be a valid date",
          },
        },
      },

      proofOfIdentity: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Proof of identity cannot be null",
          },
          notEmpty: {
            msg: "Proof of identity cannot be empty",
          },
        },
      },
      proofOfDob: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Proof of date of birth cannot be null",
          },
          notEmpty: {
            msg: "Proof of date of birth cannot be empty",
          },
        },
      },
      proofOfAddress: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Proof of address cannot be null",
          },
          notEmpty: {
            msg: "Proof of address cannot be empty",
          },
        },
      },
      oldPassportCopy: {
        type: DataTypes.STRING,
        allowNull: isRenewal,
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
        allowNull: true,
      },
    },
    {
      paranoid: true,
      freezeTableName: true,
      modelName: "passport",
    }
  );

  return passportDetails;
};

module.exports = definePassportDetails;
