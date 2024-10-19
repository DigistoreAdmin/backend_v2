"use strict";
const { Model, DataTypes,Op } = require("sequelize");
const sequelize = require("../../config/database");

const getCurrentDate = () => {
  const date = new Date();
  return `${date.getDate().toString().padStart(2, "0")}${(date.getMonth() + 1)
    .toString()
    .padStart(2, "0")}${date.getFullYear()}`;
};


const defineBusinessLoanUnscuredExisting = (cibil) => {

  const isNoCibil = cibil === "false" ? false : true;
  const isApproved = cibil === "true" ? false : true;

  const businessLoanUnscuredExisting = sequelize.define(
    "businessLoanUnscuredExisting",
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
      InvoiceCopyOfAssetsToPurchase : {
        type: DataTypes.STRING,
        allowNull: false,
      },
      BalanceSheetAndPl2Years : {
        type: DataTypes.STRING,
        allowNull: false,
      },
      BankStatement1Year : {
        type: DataTypes.STRING,
        allowNull: false,
      },
      RentAgreement : {
        type: DataTypes.STRING,
        allowNull: false,
      },
      LicenceCopy : {
        type: DataTypes.STRING,
        allowNull: false,
      },
      otherDocuments : {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: true,
      },
      GSTDetails : {
        type: DataTypes.STRING,
        allowNull: false,
      },
      cibil: {
        type: DataTypes.BOOLEAN,
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
      loanStatus: {
        type: DataTypes.JSONB,
        allowNull: true
      },
      rejectReason: {
        type: DataTypes.STRING,
        allowNull: true
      },
      bankDetails: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      loanGivenByBank: {
        type: DataTypes.BIGINT,
        allowNull: true,
      },
      doneBy: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      serviceCharge: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      commissionToFranchise: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      commissionToHO: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      otherPayments: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      otherDocumentsByStaff: {
        type: DataTypes.STRING,
        allowNull: true
      },
      status: {
        type: DataTypes.ENUM("inQueue", "inProgress", "completed"),
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
      modelName: "businessLoanUnscuredExisting",
      hooks: {
        beforeValidate: async (loan) => {
          const currentDate = getCurrentDate();
          const code = "BLUE";
          const lastLoan = await businessLoanUnscuredExisting.findOne({
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

  return businessLoanUnscuredExisting;
};

module.exports = defineBusinessLoanUnscuredExisting;
