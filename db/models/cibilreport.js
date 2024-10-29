"use strict";
const { DataTypes, Op } = require("sequelize");
const sequelize = require("../../config/database");

const getCurrentDate = () => {
  const date = new Date();
  return `${date.getDate().toString().padStart(2, "0")}${(date.getMonth() + 1)
    .toString()
    .padStart(2, "0")}${date.getFullYear()}`;
};

const createCibilReport = (purpose) => {
  const allowNullProp = purpose === "applyForCivilReport" ? false : true;
  const allowNullPro = purpose === "alreadyHaveCibilReport" ? false : true;

  const cibilReport = sequelize.define(
    "cibilReports",
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
            msg: "Mobile number cannot be null",
          },
          notEmpty: {
            msg: "Mobile number cannot be empty",
          },
          isInt: {
            msg: "Mobile number must contain only numbers",
          },
          len: {
            args: [10, 10],
            msg: "Phone number must be exactly 10 digits",
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
      purpose: {
        allowNull: true,
        type: DataTypes.ENUM("applyForCivilReport", "alreadyHaveCibilReport"),
      },
      cibilScore: {
        type: DataTypes.BIGINT,
        allowNull: allowNullPro,
      },
      cibilReport: {
        type: DataTypes.STRING,
        allowNull: allowNullPro,
      },
      aadhaarFront: {
        type: DataTypes.STRING,
        allowNull: allowNullProp,
        validate: {
          isUrl: {
            msg: "Upload URL must be a valid URL",
          },
        },
      },
      aadhaarBack: {
        type: DataTypes.STRING,
        allowNull: allowNullProp,
        validate: {
          isUrl: {
            msg: "Upload URL must be a valid URL",
          },
        },
      },
      panCardFront: {
        type: DataTypes.STRING,
        allowNull: allowNullProp,
        validate: {
          isUrl: {
            msg: "Upload URL must be a valid URL",
          },
        },
      },
      panCardBack: {
        type: DataTypes.STRING,
        allowNull: allowNullProp,
        validate: {
          isUrl: {
            msg: "Upload URL must be a valid URL",
          },
        },
      },
      amount: {
        type: DataTypes.DECIMAL,
        allowNull:true,
      },
      workId:{
        type: DataTypes.STRING,
        allowNull: true,
      },
      loanType: {
        type: DataTypes.ENUM("businessLoanUnsecuredNew","businessLoanUnscuredExisting","BusinessLoanNewSecured","businessLoanExisting","housingLoan","loanAgainstProperty","RefinanceOrUsedVehicle","newVehicle","personalLoan","microLoansShop","microLoan"),
        allowNull: true,
      },
      status: {
        allowNull: true,
        type: DataTypes.ENUM("approve", "pending", "reject", "process"),
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
      modelName: "cibilReports",
      hooks: {
        beforeValidate: async (loan) => {
          const currentDate = getCurrentDate();
          const code = "CR";
          const lastLoan = await cibilReport.findOne({
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
    },
    
  );

  return cibilReport;
};

module.exports = createCibilReport;
