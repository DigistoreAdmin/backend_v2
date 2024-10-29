"use strict";
const { Model, DataTypes, Op } = require("sequelize");
const sequelize = require("../../config/database");

const getCurrentDate = () => {
  const date = new Date();
  return `${date.getDate().toString().padStart(2, "0")}${(date.getMonth() + 1)
    .toString()
    .padStart(2, "0")}${date.getFullYear()}`;
};

const defineBusinessLoanNewSecured = (cibil) => {
  const isNoCibil = cibil === "noCibil" ? false : true;
  const isApproved = cibil === "approved" ? false : true;

  const BusinessLoanNewSecured = sequelize.define(
    "BusinessLoanNewSecured",
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      workId: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      uniqueId: {
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
      email: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      titleDeed: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Title deed is required.",
          },
          notEmpty: {
            msg: "Title deed cannot be empty.",
          },
        },
      },
      locationSketch: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Location sketch is required.",
          },
          notEmpty: {
            msg: "Location sketch cannot be empty.",
          },
        },
      },
      encumbrance: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Encumbrance certificate is required.",
          },
          notEmpty: {
            msg: "Encumbrance certificate cannot be empty.",
          },
        },
      },
      possession: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Possession certificate is required.",
          },
          notEmpty: {
            msg: "Possession certificate cannot be empty.",
          },
        },
      },
      buildingTax: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Building tax receipt is required.",
          },
          notEmpty: {
            msg: "Building tax receipt cannot be empty.",
          },
        },
      },
      landTax: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Land tax receipt is required.",
          },
          notEmpty: {
            msg: "Land tax receipt cannot be empty.",
          },
        },
      },
      invoiceCopyOfAssetsToPurchase: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "invoiceCopyOfAssetsToPurchase receipt is required.",
          },
          notEmpty: {
            msg: "invoiceCopyOfAssetsToPurchase cannot be empty.",
          },
        },
      },
      rentAgreement: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "rentAgreement is required.",
          },
          notEmpty: {
            msg: "rentAgreement cannot be empty.",
          },
        },
      },
      licenceCopy: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "licenceCopy is required.",
          },
          notEmpty: {
            msg: "licenceCopy cannot be empty.",
          },
        },
      },
      otherDocuments: {
        allowNull: true,
        type: DataTypes.ARRAY(DataTypes.STRING),
      },
      cibil: {
        type: DataTypes.ENUM("approved", "noCibil"),
        allowNull: false,
      },
      cibilAcknowledgement: {
        type: DataTypes.STRING,
        allowNull: isNoCibil,
      },
      cibilReport: {
        type: DataTypes.STRING,
        allowNull: isApproved,
      },
      cibilScore: {
        type: DataTypes.BIGINT,
        allowNull: isApproved,
      },
      loanAmount: {
        type: DataTypes.BIGINT,
        allowNull: false,
        validate: {
          notNull: {
            msg: "loan amount is required.",
          },
          notEmpty: {
            msg: "loan amount cannot be empty.",
          },
        },
      },
      sourceOfIncome: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "source of income is required.",
          },
          notEmpty: {
            msg: "source of income cannot be empty.",
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
      },
      assignedOn: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      completedOn: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      deletedAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      paranoid: true,
      freezeTableName: true,
      modelName: "BusinessLoanNewSecured",
      hooks: {
        beforeValidate: async (loan) => {
          const currentDate = getCurrentDate();
          const code = "BLNS";
          const lastLoan = await BusinessLoanNewSecured.findOne({
            where: {
              workId: {
                [Op.like]: `${currentDate}${code}%`,
              },
            },
            order: [["createdAt", "DESC"]],
          });

          let newIncrement = "001";
          if (lastLoan) {
            const lastIncrement = parseInt(lastLoan.workId.slice(-3));
            newIncrement = (lastIncrement + 1).toString().padStart(3, "0");
          }

          loan.workId = `${currentDate}${code}${newIncrement}`;
        },
      },
    }
  );

  return BusinessLoanNewSecured;
};

module.exports = defineBusinessLoanNewSecured;
