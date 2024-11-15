"use strict";
const { Model, DataTypes } = require("sequelize");
const sequelize = require("../../config/database");
const defineTrainBooking=(bookingType)=>{
const returnDateAllowNull=bookingType=="1"?true:false


const trainBooking = sequelize.define(
  "trainBooking",
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
          msg: "customer name cannot be null",
        },
        notEmpty: {
          msg: "customer name cannot be empty",
        },
      },
    },
    phoneNumber: {
      type: DataTypes.BIGINT,
      allowNull: false,
      validate: {
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
      allowNull: false,
      validate: {
        notNull: {
          msg: "email cannot be null",
        },
        notEmpty: {
          msg: "email cannot be empty",
        },
        isEmail: {
          msg: "Invalid email format",
        },
        is: {
          args: /^[^\s@]+@[^\s@]+.[^\s@]+$/,
          msg: "Email address must be in a valid format (example@example.com)",
        },
      },
    },
    boardingStation: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Boarding station cannot be null",
        },
        notEmpty: {
          msg: "Boarding station cannot be empty",
        },
      },
    },
    destinationStation: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "destination station cannot be null",
        },
        notEmpty: {
          msg: "destination station cannot be empty",
        },
      },
    },
    trainNumber: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    startDate: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        notNull: {
          msg: "start date cannot be null",
        },
        notEmpty: {
          msg: "start date cannot be empty",
        },
      },
    },
    bookingType: {
      type: DataTypes.ENUM("1", "2"),
      allowNull: false,
    },
    returnDate: {
      type: DataTypes.DATE,
      allowNull:returnDateAllowNull
    },
    ticketType: {
      type: DataTypes.ENUM(
        "General",
        "Ladies",
        "Lower berth",
        "Person with disability",
        "Duty pass",
        "Tatkal",
        "Premium tatkal"
      ),
      allowNull:false
    },
    coachType: {
      type: DataTypes.ENUM(
        "Anubhuti Class(EA)",
        "AC First Class(1A)",
        "Vistadome AC(EV)",
        "Exec. chair Car(EC)",
        "AC 2 Tier(2A)",
        "First Class(FC)",
        "AC 3 Tier(3A)",
        "AC 3 Economy(3E)",
        "Vistadome Chair Car(VC)",
        "AC Chair Car(CC)",
        "Sleeper(SL)",
        "Vistadome Non AC(VS)",
        "Second Sitting(2S)"
      ),
      allowNull:false
    },
    preference: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    passengerDetails: {
      allowNull: false,
      type: DataTypes.JSONB,
      validate: {
        notNull: {
          msg: "Passenger details cannot be null",
        },
        isValidPassengerDetails(value) {
          if (!Array.isArray(value) || value.length === 0) {
            throw new Error("Passenger details must be a non-empty array");
          }
          value.forEach((passenger) => {
            if (
              !passenger.passengerName ||
              !passenger.passengerAge ||
              !passenger.passengerGender
            ) {
              throw new Error(
                "Each passenger must have a name, age, and gender"
              );
            }
          });
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
    amount: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    workId: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    ticket: {
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
    totalAmount: {
      type: DataTypes.INTEGER,
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
    modelName: "trainBooking",
  }
);
return trainBooking
}
module.exports =defineTrainBooking