'use strict';
const { Model, Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

const businessLoanExistingDetails = (cibil) => {

  const cibilNullVal = cibil === 'true' ? false : true
  const cibilAcknowledgementNullVal = cibil === 'false' ? false : true

  const businessLoanExisting = sequelize.define(
    'businessLoanExisting',
    {
      uniqueId: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: 'Unique ID cannot be null',
          },
          notEmpty: {
            msg: 'Unique ID cannot be empty',
          },
        },
      },
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      workId: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          notNull: {
            msg: 'Work ID cannot be null',
          },
          notEmpty: {
            msg: 'Work ID cannot be empty',
          },
        },
      },
      customerName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: 'Customer name cannot be null',
          },
          notEmpty: {
            msg: 'Customer name cannot be empty',
          },
        },
      },
      email: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
          notEmpty: {
            msg: 'Customer email cannot be empty',
          },
          isEmail: {
            msg: 'Invalid email address',
          },
          is: {
            args: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            msg: "Email address must be in a valid format (example@example.com)",
          },
        },
      },
      mobileNumber: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: 'Customer mobile number cannot be null',
          },
          notEmpty: {
            msg: 'Customer mobile number cannot be empty',
          },
          isNumeric: {
            msg: 'Customer mobile number must contain only numbers',
          },
          len: {
            args: [10, 15],
            msg: 'Customer mobile number must be between 10 and 15 digits',
          },
        },
      },
      loanAmount: {
        type: DataTypes.BIGINT,
        allowNull: false,
        validate: {
          notNull: {
            msg: 'Loan amount cannot be null',
          },
          notEmpty: {
            msg: 'Loan amount cannot be empty',
          },
          isNumeric: {
            msg: 'Loan amount must be numeric',
          },
        },
      },
      cibil: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        validate: {
          notNull: {
            msg: 'cibil cannot be null',
          },
          notEmpty: {
            msg: 'cibil cannot be empty',
          }
        },
      },
      cibilScore: {
        type: DataTypes.INTEGER,
        allowNull: cibilNullVal,
        validate: {
          notEmpty: {
            msg: 'CIBIL score cannot be empty',
          },
          isInt: {
            msg: 'CIBIL score must be an integer',
          },
          min: {
            args: [300],
            msg: 'CIBIL score cannot be less than 300',
          },
          max: {
            args: [900],
            msg: 'CIBIL score cannot exceed 900',
          },
        },
      },
      cibilReport: {
        type: DataTypes.STRING,
        allowNull: cibilNullVal,
        validate: {
          notEmpty: {
            msg: 'CIBIL report cannot be empty',
          },
          isUrl: {
            msg: 'CIBIL report must be a valid URL',
          },
        },
      },
      cibilAcknowledgement: {
        type: DataTypes.STRING,
        allowNull: cibilAcknowledgementNullVal,
        validate: {
          notEmpty: {
            msg: 'CIBIL acknowledgement cannot be empty',
          },
          isUrl: {
            msg: 'CIBIL acknowledgement must be a valid URL',
          },
        },
      },
      sourceOfIncome: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: 'Source of income cannot be null',
          },
          notEmpty: {
            msg: 'Source of income cannot be empty',
          },
        },
      },
      titleDeed: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: 'Title deed cannot be null',
          },
          notEmpty: {
            msg: 'Title deed cannot be empty',
          },
          isUrl: {
            msg: 'Title deed must be a valid URL',
          },
        },
      },
      locationSketch: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: 'Location sketch cannot be null',
          },
          notEmpty: {
            msg: 'Location sketch cannot be empty',
          },
          isUrl: {
            msg: 'Location sketch must be a valid URL',
          },
        },
      },
      encumbrance: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: 'Encumbrance certificate cannot be null',
          },
          notEmpty: {
            msg: 'Encumbrance certificate cannot be empty',
          },
          isUrl: {
            msg: 'Encumbrance certificate must be a valid URL',
          },
        },
      },
      possession: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: 'Possession certificate cannot be null',
          },
          notEmpty: {
            msg: 'Possession certificate cannot be empty',
          },
          isUrl: {
            msg: 'Possession certificate must be a valid URL',
          },
        },
      },
      buildingTax: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: 'Building tax receipt cannot be null',
          },
          notEmpty: {
            msg: 'Building tax receipt cannot be empty',
          },
          isUrl: {
            msg: 'Building tax receipt must be a valid URL',
          },
        },
      },
      landTax: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: 'Land tax receipt cannot be null',
          },
          notEmpty: {
            msg: 'Land tax receipt cannot be empty',
          },
          isUrl: {
            msg: 'Land tax receipt must be a valid URL',
          },
        },
      },
      invoiceCopyOfAssetsToPurchase: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: 'Invoice copy of assets to purchase cannot be null',
          },
          notEmpty: {
            msg: 'Invoice copy of assets to purchase cannot be empty',
          },
          isUrl: {
            msg: 'Invoice copy of assets to purchase must be a valid URL',
          },
        },
      },
      balanceSheetAndP1_2Years: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: 'Balance sheet and P1 of 2 years cannot be null',
          },
          notEmpty: {
            msg: 'Balance sheet and P1 of 2 years cannot be empty',
          },
          isUrl: {
            msg: 'Balance sheet and P1 of 2 years must be a valid URL',
          },
        },
      },
      bankStatement_1Year: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: 'Bank statement of 1 year cannot be null',
          },
          notEmpty: {
            msg: 'Bank statement of 1 year cannot be empty',
          },
          isUrl: {
            msg: 'Bank statement of 1 year must be a valid URL',
          },
        },
      },
      rentAgreement: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: 'Rent agreement cannot be null',
          },
          notEmpty: {
            msg: 'Rent agreement cannot be empty',
          },
          isUrl: {
            msg: 'Rent agreement must be a valid URL',
          },
        },
      },
      licenceCopy: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: 'Licence copy cannot be null',
          },
          notEmpty: {
            msg: 'Licence copy cannot be empty',
          },
          isUrl: {
            msg: 'Licence copy must be a valid URL',
          },
        },
      },
      otherDocuments: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
          isUrl: {
            msg: 'Other documents must be valid URLs',
          },
        },
      },
      gstDetails: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: 'GST details cannot be null',
          },
          notEmpty: {
            msg: 'GST details cannot be empty',
          },
          isUrl: {
            msg: 'GST details must be a valid URL',
          },
        },
      },
      assignedId: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      status: {
        type: DataTypes.ENUM("inQueue", "inProgress", "completed"),
        allowNull: false,
        defaultValue: "inQueue"
      },
      assignedOn: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      completedOn: {
        type: DataTypes.DATE,
        allowNull: true,
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
      },
    },
    {
      paranoid: true,
      freezeTableName: true,
      modelName: 'businessLoanExisting',
      // hooks: {
      //   beforeCreate: async (businessLoanExisting, options) => {
      //     // Get current date in format DDMMYYYY
      //     const currentDate = new Date().toISOString().slice(0, 10).split('-').reverse().join('');

      //     // Count the number of entries created on the same day
      //     const count = await businessLoanExisting.count({
      //       where: {
      //         workId: {
      //           [sequelize.Op.like]: `${currentDate}BLE%`,
      //         },
      //       },
      //     });

      //     // Generate the unique workId
      //     const workId = `${currentDate}BLE${(count + 1).toString().padStart(3, '0')}`;
      //     businessLoanExisting.workId = workId;
      //   },
      // },
    }
  );
  return businessLoanExisting
}

module.exports = businessLoanExistingDetails;
