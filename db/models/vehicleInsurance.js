"use strict";
const { DataTypes } = require("sequelize");
const sequelize = require("../../config/database");

const defineVehicleInsurance = (commercialOrType2Vehicle, isPolicyExpired) => {
  const allowNull = commercialOrType2Vehicle === 'true' ? false : true;
  const allowN = isPolicyExpired === 'true' ? false : true;

  const VehicleLoan = sequelize.define(
    "vehicleInsurances",
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      uniqueId: {
        type: DataTypes.STRING,
        allowNull:false,
      },
      workId: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: 'Work ID cannot be null',
          },
          notEmpty: {
            msg: 'Work ID cannot be empty',
          },
        },
      },
      assignedId: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      assignedOn: {
        type: DataTypes.DATE,
        allowNull:true, 
      },
      completedOn: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      status: {
        type: DataTypes.ENUM("inQueue", "inProgress", "completed"),
        allowNull:false,
        defaultValue: "inQueue",
      },
      customerName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "Customer name cannot be empty",
          },
        },
      },
      mobileNumber: {
        type: DataTypes.BIGINT,
        validate: {
          isInt: {
            msg: "Mobile number must be an integer",
          },
          len: {
            args: [10, 10],
            msg: "Mobile number must be 10 digits",
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
      insuranceType: {
        type: DataTypes.ENUM(
          "fullCover",
          "bumberToBumber",
          "thirdParty",
          "standAlone"
        ),
        allowNull: false,
      },
      rcFront: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      rcBack: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      aadhaarFront: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      aadhaarBack: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      panPic: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      commercialOrType2Vehicle: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue:false,
      },
      otherDocuments: {
        type: DataTypes.STRING,
        allowNull: allowNull,
      },
      isPolicyExpired: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue:false,
      },
      vehicleFrontSide: {
        type: DataTypes.STRING,
        allowNull: allowN,
      },
      vehicleBackSide: {
        type: DataTypes.STRING,
        allowNull: allowN,
      },
      vehicleLeftSide: {
        type: DataTypes.STRING,
        allowNull: allowN,
      },
      vehicleRightSide: {
        type: DataTypes.STRING,
        allowNull: allowN,
      },
      vehicleEngineNumber: {
        type: DataTypes.STRING,
        allowNull: allowN,
      },
      vehicleChasisNumber: {
        type: DataTypes.STRING,
        allowNull: allowN,
      },
      policyDocument: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      companyName: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      throughWhom: {
        type: DataTypes.ENUM("GIBIL", "ownCode"),
        allowNull: true,
      },
      commissionToFranchise: {
        type: DataTypes.DECIMAL,
        allowNull: true,
      },
      commissionToHeadOffice: {
        type: DataTypes.DECIMAL,
        allowNull: true,
      },
      odPremiumAmount: {
        type: DataTypes.DECIMAL,
        allowNull: true,
      },
      tpPremiumAmount:{
        type: DataTypes.DECIMAL,
        allowNull: true,
      },
      odPoint: {
        type: DataTypes.DECIMAL,
        allowNull: true,
      },
      tpPoint: {
        type: DataTypes.DECIMAL,
        allowNull: true,
      },
      paCoverPoint: {
        type: DataTypes.DECIMAL,
        allowNull: true,
      },
      paCoverAmount: {
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
      modelName: "vehicleInsurances",
    }
  );

  return VehicleLoan;
};

module.exports = defineVehicleInsurance;