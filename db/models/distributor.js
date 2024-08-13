const { DataTypes } = require("sequelize");
const sequelize = require("../../config/database");
const bcrypt = require("bcrypt");

const Distributors = sequelize.define(
  "distributors",
  {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Password cannot be null",
        },
        notEmpty: {
          msg: "Password cannot be empty",
        },
        len: {
          args: [8],
          msg: "Password must be at least 8 characters",
        },
      },
    },
    userType: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "distributor",
      validate: {
        notNull: {
          msg: "User type cannot be null",
        },
        notEmpty: {
          msg: "User type cannot be empty",
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
        isNumeric: {
          msg: "Mobile number must be numeric",
        },
        len: {
          args: [10, 10],
          msg: "Mobile number must be 10 digits",
        },
      },
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Name cannot be null",
        },
        notEmpty: {
          msg: "Name cannot be empty",
        },
      },
    },
    distributorName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Distributor name cannot be null",
        },
        notEmpty: {
          msg: "Distributor name cannot be empty",
        },
      },
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "E-mail cannot be null",
        },
        notEmpty: {
          msg: "E-mail cannot be empty",
        },
      },
    },
    gender: {
      type: DataTypes.ENUM("male", "female"),
      allowNull: false,
      validate: {
        notNull: {
          msg: "Gender cannot be null",
        },
        notEmpty: {
          msg: "Gender cannot be empty",
        },
      },
    },
    dateOfBirth: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Date Of Birth cannot be null",
        },
        notEmpty: {
          msg: "Date Of Birth cannot be empty",
        },
      },
    },
    distributorAddressLine1: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Address line 1 cannot be null",
        },
        notEmpty: {
          msg: "Address line 1 cannot be empty",
        },
      },
    },
    distributorAddressLine2: {
      type: DataTypes.STRING,
    },
    postOffice: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    pinCode: {
      type: DataTypes.BIGINT,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Pin code cannot be null",
        },
        notEmpty: {
          msg: "Pin code cannot be empty",
        },
        isInt: {
          msg: "Pin code must be an integer",
        },
      },
    },
    district: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "District cannot be null",
        },
        notEmpty: {
          msg: "District cannot be empty",
        },
      },
    },
    state: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "State cannot be null",
        },
        notEmpty: {
          msg: "State cannot be empty",
        },
      },
    },
    bankName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Bank Name cannot be null",
        },
        notEmpty: {
          msg: "Bank Name cannot be empty",
        },
      },
    },
    branchName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    accountNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Account Number cannot be null",
        },
        notEmpty: {
          msg: "Account Number cannot be empty",
        },
      },
    },
    ifscCode: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "IFSC Code cannot be null",
        },
        notEmpty: {
          msg: "IFSC Code cannot be empty",
        },
      },
    },
    accountName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Account Name cannot be null",
        },
        notEmpty: {
          msg: "Account Name cannot be empty",
        },
      },
    },
    aadhaarNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Adhaar number cannot be null",
        },
        notEmpty: {
          msg: "Adhaar number cannot be empty",
        },
      },
    },
    panNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "PAN number cannot be null",
        },
        notEmpty: {
          msg: "PAN number cannot be empty",
        },
      },
    },
    aadhaarFrontImage: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Image cannot be null",
        },
      },
    },
    aadhaarBackImage: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Image cannot be null",
        },
      },
    },
    panCardImage: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Image cannot be nulll",
        },
      },
    },
    bankPassbookImage: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Image cannot be nulll",
        },
      },
    },
    onBoardedBy: {
      type: DataTypes.ENUM(
        "admin",
        "fieldExecutive",
        "teleCaller",
        "collegeQuest",
        "itsSelf"
      ),
      allowNull: false,
      defaultValue: "itsSelf",
    },
    onBoardedPersonId: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    onBoardedPersonName: {
      type: DataTypes.STRING,
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
    modelName: "distributors",
  }
);

module.exports = Distributors;

Distributors.beforeCreate(async (distributor) => {
  console.log("lllwsds");
  if (distributor.password && typeof distributor.password === "string") {
    distributor.password = await bcrypt.hash(distributor.password, 8);
  }

  if (
    distributor.aadhaarNumber &&
    typeof distributor.aadhaarNumber === "number"
  ) {
    distributor.aadhaarNumber = await bcrypt.hash(
      distributor.aadhaarNumber.toString(),
      8
    );
  }

  if (
    distributor.accountNumber &&
    typeof distributor.accountNumber === "number"
  ) {
    distributor.accountNumber = await bcrypt.hash(
      distributor.accountNumber.toString(),
      8
    );
  }
});
