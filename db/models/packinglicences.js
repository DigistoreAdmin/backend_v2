"use strict";
const { Model, DataTypes, Op } = require("sequelize");
const sequelize = require("../../config/database");

const getCurrentDate = () => {
  const date = new Date();
  return `${date.getDate().toString().padStart(2, "0")}${(date.getMonth() + 1)
    .toString()
    .padStart(2, "0")}${date.getFullYear()}`;
};

const PackingLicences = sequelize.define(
  "packingLicences",
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
    workId: {
      type: DataTypes.STRING,
      allowNull: true
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
          msg: "Invalid email format",
        },
        is: {
          args: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
          msg: "Email address must be in a valid format (example@example.com)",
        },
      },
    },
    businessName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Business name cannot be null",
        },
        notEmpty: {
          msg: "Business name cannot be empty",
        },
      },
    },
    businessAddressLine1: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Business address line 1 cannot be null",
        },
        notEmpty: {
          msg: "Business address line 1 cannot be empty",
        },
      },
    },
    businessAddressLine2: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Business address line 2 cannot be null",
        },
        notEmpty: {
          msg: "Business address line 2 cannot be empty",
        },
      },
    },
    pinCode: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Pin code cannot be null",
        },
        notEmpty: {
          msg: "Pin code cannot be empty",
        },
        isNumeric: {
          msg: "Pin code must contain only numbers",
        },
        len: {
          args: [6, 6],
          msg: "Pin code must be exactly 6 digits",
        },
      },
    },
    listOfProducts: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    aadhaarFront: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isUrl: {
          msg: "Upload URL must be a valid URL",
        },
      },
    },
    aadhaarBack: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isUrl: {
          msg: "Upload URL must be a valid URL",
        },
      },
    },
    panCard: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isUrl: {
          msg: "Upload URL must be a valid URL",
        },
      },
    },
    fassaiRegistrationCertificate: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isUrl: {
          msg: "Upload URL must be a valid URL",
        },
      },
    },
    buildingTaxReceipt: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isUrl: {
          msg: "Upload URL must be a valid URL",
        },
      },
    },
    rentAgreement: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isUrl: {
          msg: "Upload URL must be a valid URL",
        },
      },
    },
    ownershipCertificate: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isUrl: {
          msg: "Upload URL must be a valid URL",
        },
      },
    },
    selfDeclaration: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isUrl: {
          msg: "Upload URL must be a valid URL",
        },
      },
    },
    photo: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isUrl: {
          msg: "Upload URL must be a valid URL",
        },
      },
    },
    signature: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isUrl: {
          msg: "Upload URL must be a valid URL",
        },
      },
    },
    status: {
      type: DataTypes.ENUM("inQueue", "inProgress", "completed","rejected"),
      allowNull: false,
      defaultValue: "inQueue",
    },
    assignedId: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        isInt: {
          msg: "Assigned ID must be an String",
        },
      },
    },
    assignedOn: {
      type: DataTypes.DATE,
      allowNull: true,
      validate: {
        isDate: {
          msg: "Assigned On must be a valid date",
        },
      },
    },
    completedOn: {
      type: DataTypes.DATE,
      allowNull: true,
      validate: {
        isDate: {
          msg: "Completed On must be a valid date",
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
    modelName: "packingLicences",
    hooks: {
      beforeValidate: async (packing) => {
        const currentDate = getCurrentDate();
        const code = "PAL";
        const lastPan = await PackingLicences.findOne({
          where: {
            workId: {
              [Op.like]: `${currentDate}${code}%`,
            },
          },
          order: [["createdAt", "DESC"]],
        });

        let newIncrement = "001";
        if (lastPan) {
          const lastIncrement = parseInt(lastPan.workId.slice(-3));
          newIncrement = (lastIncrement + 1).toString().padStart(3, "0");
        }

        packing.workId = `${currentDate}${code}${newIncrement}`;
      },
    },
  }
);

module.exports = PackingLicences;
