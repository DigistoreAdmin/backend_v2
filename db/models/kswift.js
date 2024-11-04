"use strict";
const { Model, DataTypes, Op } = require("sequelize");
const sequelize = require("../../config/database");

const getCurrentDate = () => {
  const date = new Date();
  return `${date.getDate().toString().padStart(2, "0")}${(date.getMonth() + 1)
    .toString()
    .padStart(2, "0")}${date.getFullYear()}`;
};

const kswift = sequelize.define(
  "kswift",
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
    status:{
      type: DataTypes.ENUM('inQueue','inProgress','completed',"onHold","rejected"),
      default:'inQueue',
    },
    phoneNumber: {
      type: DataTypes.BIGINT,
      allowNull: false,
      validate: {
        isInt: {
          msg: "mobile number must be an integer",
        },
        len: {
          args: [10, 10],
          msg: "mobile number must be 10 digits",
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
    businessName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "business name cannot be null",
        },
        notEmpty: {
          msg: "business name cannot be empty",
        },
      },
    },
    businessAddressLine1: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "address line1 name cannot be null",
        },
        notEmpty: {
          msg: "address line1 cannot be empty",
        },
      },
    },
    businessAddressLine2: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "address line2 name cannot be null",
        },
        notEmpty: {
          msg: "address line2 cannot be empty",
        },
      },
    },
    pinCode: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: {
          msg: "pincode cannot be null",
        },
        notEmpty: {
          msg: "pincode cannot be empty",
        },
        isInt: {
          msg: "pincode must be an integer",
        },
        len: [6, 6],
      },
    },
    businessType: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "business type cannot be null",
        },
        notEmpty: {
          msg: "business type cannot be empty",
        },
      },
    },
    aadhaarFront: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "aadhaarFront cannot be null",
        },
        notEmpty: {
          msg: "aadhaarFront cannot be empty",
        },
      },
    },
    aadhaarBack: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "aadhaarBack cannot be null",
        },
        notEmpty: {
          msg: "aadhaarBack cannot be empty",
        },
      },
    },
    signature: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "signature cannot be null",
        },
        notEmpty: {
          msg: "signature cannot be empty",
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
    modelName: "kswift",
    hooks: {
      beforeValidate: async (kswifts) => {
        const currentDate = getCurrentDate();
        const code = "KS";
        const lastPan = await kswift.findOne({
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

        kswifts.workId = `${currentDate}${code}${newIncrement}`;
      },
    },
  }
);

module.exports = kswift;
