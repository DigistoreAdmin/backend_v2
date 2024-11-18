"use strict";
const { Model, DataTypes, Op } = require("sequelize");
const sequelize = require("../../config/database");

const getCurrentDate = () => {
  const date = new Date();
  return `${date.getDate().toString().padStart(2, "0")}${(date.getMonth() + 1)
    .toString()
    .padStart(2, "0")}${date.getFullYear()}`;
};

const PartnershipDeedPreparation = sequelize.define(
  "partnershipDeedPreparation",
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
      validate: {
        notNull: {
          msg: "Phone Number cannot be null",
        },
        notEmpty: {
          msg: "Phone Number cannot be empty",
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
    businessAddress: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Business address cannot be null",
        },
        notEmpty: {
          msg: "Business address cannot be empty",
        },
      },
    },
    numberOfPartners: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    partners: {
      type: DataTypes.JSON,
      allowNull: false,
      validate: {
        isValidArrayOfObjects(value) {
          if (!Array.isArray(value)) {
            throw new Error("Partners must be an array of objects");
          }
          value.forEach((partner) => {
            if (
              typeof partner.panCard !== "string" ||
              typeof partner.aadhaarFront !== "string" ||
              typeof partner.aadhaarBack !== "string" ||
              typeof partner.photo !== "string" ||
              typeof partner.signature !== "string" ||
              typeof partner.addressLine1 !== "string" ||
              typeof partner.addressLine1 !== "string"
            ) {
              throw new Error(
                "Each partner must contain panCard, aadhaarFront, aadhaarBack, photo, addressLine1 and addressLine2 as strings"
              );
            }
          });
        },
      },
    },
    bankAmountStatement: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isUrl: {
          msg: "Bank Amount Statement Receipt URL must be a valid URL",
        },
      },
    },
    rentOrLeaseAgreement: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isUrl: {
          msg: "Rent or Lease Agreement URL must be a valid URL",
        },
      },
    },
    latestPropertyTax: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isUrl: {
          msg: "Latest Property Tax URL must be a valid URL",
        },
      },
    },
    LandTaxRecipt: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isUrl: {
          msg: "Land tax Recipt URL must be a valid URL",
        },
      },
    },
    assignedId: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    status: {
      allowNull: false,
      type: DataTypes.ENUM("inQueue", "inProgress", "completed", "rejected"),
      defaultValue: "inQueue",
    },
    assignedOn: {
      allowNull: true,
      type: DataTypes.DATE,
    },
    completedOn: {
      type: DataTypes.DATE,
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
    modelName: "partnershipDeedPreparation",
    hooks: {
      beforeValidate: async (partnership) => {
        const currentDate = getCurrentDate();
        const code = "PDP";
        const lastPan = await PartnershipDeedPreparation.findOne({
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

        partnership.workId = `${currentDate}${code}${newIncrement}`;
      },
    },
  }
);

module.exports = PartnershipDeedPreparation;
