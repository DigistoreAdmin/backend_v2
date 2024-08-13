const { DataTypes } = require("sequelize");
const sequelize = require("../../config/database");
const Franchise = require("./franchise");

const defineMoneyTransferDetails = (transactionType) => {
  console.log(transactionType);
  const allowNullValue = ['banking', 'internetBanking'].includes(transactionType) ? false : true;
  const allowNullVe = ['banking', 'internetBanking', 'upi'].includes(transactionType) ? false : true;
  const allow = transactionType === 'executive' ? false : true;
  const allowNullV = transactionType === 'upi' ? false : true;

  const moneyTransferDetails = sequelize.define(
    "moneyTransferDetails",
    {
      uniqueId: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      userName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Username cannot be null",
          },
          notEmpty: {
            msg: "Username cannot be empty",
          },
        },
      },
      transationId: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Transaction ID cannot be null",
          },
          notEmpty: {
            msg: "Transaction ID cannot be empty",
          },
          len: [10, 20],
        },
      },
      fromAcc: {
        type: DataTypes.BIGINT,
        allowNull: allowNullValue,
      },
      toAcc: {
        type: DataTypes.BIGINT,
        allowNull: allowNullValue,
      },
      fromUpiId: {
        type: DataTypes.STRING,
        allowNull: allowNullV,
      },
      toUpiId: {
        type: DataTypes.STRING,
        allowNull: allowNullV,
      },
      executiveName: {
        type: DataTypes.STRING,
        allowNull: allow,
      },
      executiveId: {
        type: DataTypes.BIGINT,
        allowNull: allow,
      },
      referenceNo: {
        type: DataTypes.BIGINT,
        allowNull: allowNullVe,
      },
      amount: {
        type: DataTypes.DECIMAL(10, 2), // Changed to DECIMAL data type
        allowNull: false,
        validate: {
          notNull: {
            msg: "Amount cannot be null",
          },
          notEmpty: {
            msg: "Amount cannot be empty",
          },
        },
      },
      status: {
        type: DataTypes.ENUM('pending', 'rejected', 'approved'),
        allowNull: false,
        defaultValue: 'pending'
      },
      date: {
        type: DataTypes.DATE, // Changed to DATE data type
        allowNull: false,
        validate: {
          notNull: {
            msg: "Date cannot be null",
          },
          notEmpty: {
            msg: "Date cannot be empty",
          },
        },
      },
      remark: {
        type: DataTypes.STRING,
        allowNull: allowNullValue,
      },
      transactionType: {
        type: DataTypes.ENUM('banking', 'internetBanking', 'executive', 'upi'),
        allowNull: false,
      },
      documentPic: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: allowNullValue,
      },
      deletedAt: {
        type: DataTypes.DATE,
      }
    },
    {
      paranoid: true,
      freezeTableName: true,
      modelName: "moneyTransferDetails",
    }
  );

  moneyTransferDetails.belongsTo(Franchise, { foreignKey: "uniqueId" });

  return moneyTransferDetails;
};

module.exports = defineMoneyTransferDetails;
