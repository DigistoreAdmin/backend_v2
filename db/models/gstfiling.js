'use strict';
const { Model, DataTypes, Op } = require('sequelize');
const sequelize = require('../../config/database');

const getCurrentDate = () => {
  const date = new Date();
  return `${date.getDate().toString().padStart(2, "0")}${(date.getMonth() + 1)
    .toString()
    .padStart(2, "0")}${date.getFullYear()}`;
};

const GstFilings = sequelize.define(
  'gstFilings',
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
          msg: 'Customer name cannot be null',
        },
        notEmpty: {
          msg: 'Customer name cannot be empty',
        },
      },
    },
    phoneNumber: {
      type: DataTypes.BIGINT,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Phone number cannot be null',
        },
        notEmpty: {
          msg: 'Phone number cannot be empty',
        },
        isNumeric: {
          msg: 'Phone number must contain only numbers',
        },
        len: {
          args: [10, 15],
          msg: 'Phone number must be between 10 and 15 digits',
        },
      },
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Email cannot be null',
        },
        notEmpty: {
          msg: 'Email cannot be empty',
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
    businessName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Business name cannot be null',
        },
        notEmpty: {
          msg: 'Business name cannot be empty',
        },
      },
    },
    gstNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'GST number cannot be null',
        },
        notEmpty: {
          msg: 'GST number cannot be empty',
        },
      },
    },
    gstUsername: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'GST username cannot be null',
        },
        notEmpty: {
          msg: 'GST username cannot be empty',
        },
      },
    },
    gstPassword: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'GST password cannot be null',
        },
        notEmpty: {
          msg: 'GST password cannot be empty',
        },
      },
    },
    bills: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        isUrl: {
          msg: 'Bills must be a valid URL',
        },
      },
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
    modelName: 'gstFilings',
    hooks: {
      beforeValidate: async (gstFilings) => {
        const currentDate = getCurrentDate();
        const code = "GSF";
        const lastPan = await GstFilings.findOne({
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

        gstFilings.workId = `${currentDate}${code}${newIncrement}`;
      },
    },
  }
);

module.exports = GstFilings;