const { DataTypes } = require("sequelize");
const sequelize = require("../../config/database");

const usedvehicleLoan = (typeofLoan, cibil) => {
  const allowNullCibilApp = cibil === "true" ? false : true;
  const allowNullNoCibil = cibil === "false" ? false : true;
  const allowNullbus = typeofLoan === "business" ? false : true;
  const allowNullsal = typeofLoan === "salaried" ? false : true;

  const usedvehicleLoan = sequelize.define(
    "usedvehicleLoan",
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
        validate: {
          notNull: {
            msg: "Work ID cannot be null",
          },
          notEmpty: {
            msg: "Work ID cannot be empty",
          },
        },
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
      typeofLoan: {
        allowNull: false,
        type: DataTypes.ENUM("business", "salaried"),
      },
      salarySlip: {
        type: DataTypes.STRING,
        allowNull: allowNullsal,
        validate: {
          notEmpty: {
            msg: "Salary slip cannot be empty",
          },
        },
      },
      bankStatement: {
        type: DataTypes.STRING,
        allowNull: allowNullsal,
        validate: {
          notEmpty: {
            msg: "Bank statement cannot be empty",
          },
        },
      },
      cancelledCheque: {
        type: DataTypes.STRING,
        allowNull: allowNullsal,
        validate: {
          notEmpty: {
            msg: "Cancelled cheque cannot be empty",
          },
        },
      },
      photo: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "Photo cannot be empty",
          },
        },
      },
      ITR: {
        type: DataTypes.STRING,
        allowNull: allowNullbus,
        validate: {
          notEmpty: {
            msg: "ITR cannot be empty",
          },
        },
      },
      rentAgreement: {
        type: DataTypes.STRING,
        allowNull: allowNullbus,
        validate: {
          notEmpty: {
            msg: "Rent Agreement cannot be empty",
          },
        },
      },
      panchayathOrMuncipleLicence: {
        type: DataTypes.STRING,
        allowNull: allowNullbus,
        validate: {
          notEmpty: {
            msg: "panchayath Or MuncipleLicence cannot be empty",
          },
        },
      },
      invoiceFromDealer: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "Invoice From Dealer cannot be empty",
          },
        },
      },
      RC_Copy: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "RC Copy cannot be empty",
          },
        },
      },
      insuranceCopy: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "Insurance cannot be empty",
          },
        },
      },
      cibil: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
      cibilScore: {
        type: DataTypes.BIGINT,
        allowNull: allowNullCibilApp,
        validate: {
          notEmpty: {
            msg: "Cibil score cannot be empty",
          },
        },
      },
      cibilReport: {
        type: DataTypes.STRING,
        allowNull: allowNullCibilApp,
        validate: {
          notEmpty: {
            msg: "Cibil Report cannot be empty",
          },
        },
      },
      acknowledgment: {
        type: DataTypes.STRING,
        allowNull: allowNullNoCibil,
        validate: {
          notEmpty: {
            msg: "Acknowledgment cannot be empty",
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
        type: DataTypes.ENUM("inQueue", "inProgress", "completed","rejected"),
        allowNull: false,
        defaultValue: "inQueue",
      },
      assignedId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          isInt: {
            msg: "Assigned ID must be an integer",
          },
        },
      },
      assignedOn: {
        type: DataTypes.DATE,
        allowNull: false,
        validate: {
          isDate: {
            msg: "Assigned On must be a valid date",
          },
        },
      },
      completedOn: {
        type: DataTypes.DATE,
        allowNull: false,
        validate: {
          isDate: {
            msg: "Completed On must be a valid date",
          },
        },
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
      },
    },
    {
      paranoid: true,
      freezeTableName: true,
      modelName: "usedvehicleLoan",
    }
  );

  return usedvehicleLoan;
};

module.exports = usedvehicleLoan;
