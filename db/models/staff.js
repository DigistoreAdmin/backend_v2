const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Staff extends Model {
    static associate(models) {}
  }
  Staff.init(
    {
      employeeId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      firstName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      emailId: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          isEmail: true,
        },
      },
      mobileNumber: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          isInt: true,
          len: [10, 10],
        },
      },
      dateOfBirth: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      gender: {
        type: DataTypes.ENUM("Male", "Female", "Other"),
        allowNull: false,
      },
      addressLine1: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      addressLine2: {
        type: DataTypes.STRING,
      },
      city: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      district: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      state: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      pinCode: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          isInt: true,
          len: [6, 6],
        },
      },
      bank: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      accountNumber: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      ifscCode: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      accountHolderName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      staffType: {
        type: DataTypes.ENUM("Office Staff", "Field Executive Staff"),
        allowNull: false,
      },
      districtOfOperation: {
        type: DataTypes.STRING,
        allowNull: function () {
          return this.staffType === "Field Executive Staff";
        },
      },
      reportingManager: {
        type: DataTypes.STRING,
        allowNull: function () {
          return this.staffType === "Field Executive Staff";
        },
      },
      laptop: {
        type: DataTypes.STRING,
        allowNull: function () {
          return this.staffType === "Field Executive Staff";
        },
      },
      idCard: {
        type: DataTypes.STRING,
        allowNull: function () {
          return this.staffType === "Field Executive Staff";
        },
      },
      sim: {
        type: DataTypes.STRING,
        allowNull: function () {
          return this.staffType === "Field Executive Staff";
        },
      },
      other: {
        type: DataTypes.STRING,
        allowNull: function () {
          return this.staffType === "Field Executive Staff";
        },
      },
      phone: {
        type: DataTypes.INTEGER,
        allowNull: function () {
          return this.staffType === "Field Executive Staff";
        },
      },
      remarks: {
        type: DataTypes.STRING,
        allowNull: function () {
          return this.staffType === "Field Executive Staff";
        },
      },
    },
    {
      sequelize,
      modelName: "Staff",
      tableName: "staff",
      timestamps: true,
    }
  );
  return Staff;
};
