"use strict";
const bcrypt = require("bcrypt");
const { DataTypes, Op } = require("sequelize");
const sequelize = require("../../config/database");

const getCurrentDate = () => {
  const date = new Date();
  return `${date.getDate().toString().padStart(2, "0")}${(date.getMonth() + 1)
    .toString()
    .padStart(2, "0")}${date.getFullYear()}`;
};

const incomeTaxFilingDetails = (
  typeofTransaction,
  typeofCapitalGain,
  securities
) => {
  console.log("typeof transaction::", typeofTransaction);
  console.log("typeof typeofCapitalGain::", typeofCapitalGain);
  console.log("typeof securites:", securities);

  const allowsecurity = ["companyShares", "mutualFunds"].includes(securities)
    ? false
    : true;

  const allowNullValue = typeofTransaction === "business" ? false : true;
  const allowNullValSal = typeofTransaction === "salaried" ? false : true;
  const allowNullValCap = typeofTransaction === "capitalGain" ? false : true;
  const allowNullValCapSec = typeofCapitalGain === "securities" ? false : true;
  const allowNullValCapProp = typeofCapitalGain === "property" ? false : true;

  const incomeTaxFiling = sequelize.define(
    "incomeTax",
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
            args: /^[^\s@]+@[^\s@]+.[^\s@]+$/,
            msg: "Email address must be in a valid format (example@example.com)",
          },
        },
      },
      phoneNumber: {
        type: DataTypes.BIGINT,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Mobile number cannot be null",
          },
          notEmpty: {
            msg: "Mobile number cannot be empty",
          },
          isNumeric: {
            msg: "Mobile number must be numeric",
          },
          len: {
            args: [10, 10],
            msg: "Mobile number must be 10 digits",
          },
        },
      },
      panNumber: {
        allowNull: false,
        type: DataTypes.STRING,
        validate: {
          notNull: {
            msg: "PAN number is required",
          },
          len: {
            args: [10],
            msg: "PAN number must be exactly 10 characters long",
          },
          is: {
            args: /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/,
            msg: "PAN number must follow the format: 5 letters, 4 digits, and 1 letter (e.g., ABCDE1234F)",
          },
        },
      },
      incomeTaxPassword: {
        allowNull: false,
        type: DataTypes.STRING,
        validate: {
          notNull: {
            msg: "Income Tax password is required",
          },
          len: {
            args: [8],
            msg: "Password must be at least 8 characters",
          },
        },
      },
      typeofTransaction: {
        type: DataTypes.ENUM("business", "salaried", "capitalGain", "other"),
        allowNull: false,
      }, //if business  start here
      gstUsername: {
        allowNull: allowNullValue,
        type: DataTypes.STRING,
      },
      gstPassword: {
        allowNull: allowNullValue,
        type: DataTypes.STRING,
      },
      bankStatement: {
        type: DataTypes.STRING,
        allowNull: allowNullValue,
      },
      businessLoanStatement: {
        type: DataTypes.STRING,
        allowNull: allowNullValue,
      },
      aadhaarFront: {
        type: DataTypes.STRING,
        allowNull: allowNullValue,
      },
      aadhaarBack: {
        type: DataTypes.STRING,
        allowNull: allowNullValue,
      },
      accountName: {
        type: DataTypes.STRING,
        allowNull: allowNullValue,
      },
      accountNumber: {
        type: DataTypes.STRING,
        allowNull: allowNullValue,
      },
      ifscCode: {
        type: DataTypes.STRING,
        allowNull: allowNullValue,
      },
      branchName: {
        type: DataTypes.STRING,
        allowNull: allowNullValue,
      }, //business end here
      form16: {
        //salaried start here
        type: DataTypes.STRING,
        allowNull: allowNullValSal,
      },
      pfAmount: {
        type: DataTypes.BIGINT,
        allowNull: allowNullValSal,
      },
      healthInsuranceAmount: {
        type: DataTypes.BIGINT,
        allowNull: allowNullValSal,
      },
      npsNumber: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: allowNullValSal,
      },
      lifeInsuranceAmount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: allowNullValSal,
      },
      rentPaid: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: allowNullValSal,
      },
      tuitionFees: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: allowNullValSal,
      },
      housingLoanBankStatement: {
        type: DataTypes.STRING,
        allowNull: allowNullValSal,
      },
      salarySlip: {
        type: DataTypes.STRING,
        allowNull: allowNullValSal,
      },
      electricVehiclePurchase: {
        type: DataTypes.STRING,
        allowNull: allowNullValSal,
      },
      //salaried end here
      //capital Gain starts Here
      typeofCapitalGain: {
        allowNull: allowNullValCap,
        type: DataTypes.ENUM("property", "securities"),
      },
      saleDeed: {
        type: DataTypes.STRING,
        allowNull: allowNullValCapProp,
      },
      purchaseDeed: {
        type: DataTypes.STRING,
        allowNull: allowNullValCapProp,
      },
      securities: {
        allowNull: allowNullValCapSec,
        type: DataTypes.ENUM("companyShares", "mutualFunds"),
      },
      saleDate: {
        type: DataTypes.DATE,
        allowNull: allowsecurity,
      },
      saleAmount: {
        allowNull: allowsecurity,
        type: DataTypes.DECIMAL(10, 2),
      },
      companyName: {
        type: DataTypes.STRING,
        allowNull: allowsecurity,
      },
      purchaseDate: {
        type: DataTypes.DATE,
        allowNull: allowsecurity,
      },
      purchaseAmount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: allowsecurity,
      },
      isinNumber: {
        type: DataTypes.BIGINT,
        allowNull: allowsecurity,
      },
      otherDetails: {
        allowNull: true,
        type: DataTypes.ARRAY(DataTypes.STRING),
      },
      status: {
        allowNull: false,
        type: DataTypes.ENUM("inQueue", "inProgress", "completed","rejected"),
        defaultValue: "inQueue",
      },
      workId: {
        type: DataTypes.STRING,
        allowNull:false,
      },
      computationFile: {
        type: DataTypes.STRING,
        allowNull:true,
      },
      incomeTaxAcknowledgement: {
        type: DataTypes.STRING,
        allowNull:true,
      },
      franchiseCommission: {
        type: DataTypes.DECIMAL,
        allowNull: true,
      },
      HOCommission: {
        type: DataTypes.DECIMAL,
        allowNull: true,
      },
      totalAmount: {
        type: DataTypes.DECIMAL,
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
      modelName: "incomeTax",
      hooks: {
        beforeValidate: async (loan) => {
          const currentDate = getCurrentDate();
          const code = "ITR";
          const lastIncomeTax = await incomeTaxFiling.findOne({
            where: {
              workId: {
                [Op.like]: `${currentDate}${code}%`,
              },
            },
            order: [["createdAt", "DESC"]],
          });

          let newIncrement = "001";
          if (lastIncomeTax) {
            const lastIncrement = parseInt(lastIncomeTax.workId.slice(-3));
            newIncrement = (lastIncrement + 1).toString().padStart(3, "0");
          }

          loan.workId = `${currentDate}${code}${newIncrement}`;
        },
      },
    }
  );

  incomeTaxFiling.beforeCreate(async (incomeTax) => {
    if (
      incomeTax.incomeTaxPassword &&
      typeof incomeTax.incomeTaxPassword === "string"
    ) {
      incomeTax.incomeTaxPassword = await bcrypt.hash(
        incomeTax.incomeTaxPassword,
        8
      );
    }
    if (incomeTax.panNumber && typeof incomeTax.panNumber === "string") {
      incomeTax.panNumber = await bcrypt.hash(incomeTax.panNumber, 8);
    }
    if (incomeTax.gstPassword && typeof incomeTax.gstPassword === "string") {
      incomeTax.gstPassword = await bcrypt.hash(incomeTax.gstPassword, 8);
    }
  });
  return incomeTaxFiling;
};

module.exports = incomeTaxFilingDetails;
