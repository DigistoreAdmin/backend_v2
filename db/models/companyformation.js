"use strict";
const { Model,DataTypes, Op } = require("sequelize");
const sequelize=require('../../config/database')

const getCurrentDate = () => {
  const date = new Date();
  return `${date.getDate().toString().padStart(2, "0")}${(date.getMonth() + 1)
    .toString()
    .padStart(2, "0")}${date.getFullYear()}`;
};

const CompanyFormations = sequelize.define(
  "companyFormations",{
    id:{
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    uniqueId:{
      type:DataTypes.STRING,
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
                    msg: 'Phone number must contain only numbers',
                },
                len: {
                    args: [10, 10],
                    msg: 'Phone number must be exactly 10 digits',
                },
            }
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
                notNull: {
                    msg: 'email cannot be null',
                },
                notEmpty: {
                    msg: 'email cannot be empty',
                },
                isEmail: {
                    msg: 'Invalid email format',
                },
                is: {
                  args: /^[^\s@]+@[^\s@]+.[^\s@]+$/,
                  msg: 'Email address must be in a valid format (example@example.com)',
              }
            }
    },
    businessType: {
      type: DataTypes.ENUM("proprietary","partnership","company"),  
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Building type cannot be null',
        },
        notEmpty: {
          msg: 'Building type cannot be empty',
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
          msg: 'Business address line 1 cannot be null',
        },
        notEmpty: {
          msg: 'Business address line 1 cannot be empty',
        },
      },
    },
    businessAddressLine2: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    numberOfDirectors:{
      type: DataTypes.INTEGER,
      allowNull:false,
      validate: {
        notNull: {
          msg: 'Number of director cannot be null',
        },
        notEmpty: {
          msg: 'Number of director cannot be empty',
        },
      },
    },
    directorDetails: {
      type: DataTypes.JSONB,
      allowNull: false,
      validate: {
        isValidDirectorsDetails(value) {
          if (!Array.isArray(value) || value.length === 0) {
            throw new Error('Partners details must be a non-empty array');
          }
    
          // Define a URL validation regex pattern
          const urlRegex = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i;
    
          // Validate each director's details
          value.forEach((director, index) => {
            const {
              panCard,
              aadhaarFront,
              aadhaarBack,
              bankStatement,
              signature,
              photo,
              digitalSignatureCertificate,
              addressProof,
            } = director;
    
            // Create an array of fields to validate
            const fieldsToValidate = [
              { name: 'panCard', value: panCard },
              { name: 'aadhaarFront', value: aadhaarFront },
              { name: 'aadhaarBack', value: aadhaarBack },
              { name: 'bankstatement', value: bankStatement },
              { name: 'signature', value: signature },
              { name: 'photo', value: photo },
              { name: 'digitalSignatureCertificate', value: digitalSignatureCertificate },
              { name: 'addressproof', value: addressProof },
            ];
    
            // Check each field's value against the URL regex
            fieldsToValidate.forEach(field => {
              if (!urlRegex.test(field.value)) {
                throw new Error(`Invalid URL for ${field.name} in director ${index + 1}. All required files must be valid URLs.`);
              }
            });
          });
        }
      }
    },
    
    addressProof:{
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        isUrl: {
          msg: 'address proof file must be a valid URL',
        },
      },
    },
    bankStatement:{
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        isUrl: {
          msg: 'bank statements file must be a valid URL',
        },
      },
    },
    NOC:{
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        isUrl: {
          msg: 'NOC from building owner file must be a valid URL',
        },
      },
    },
    educationDetails:{
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        isUrl: {
          msg: 'education details file must be a valid URL',
        },
      },
    },
    rentAgreement:{
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        isUrl: {
          msg: 'rent agreement file must be a valid URL',
        },
      },
    },
    shareHoldingDetails:{
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "share holding details cannot be null",
        },
        notEmpty: {
          msg: "share holding details cannot be empty",
        },
      },
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE
    },
    deletedAt: {
      type: DataTypes.DATE
    }
  },
  {
    paranoid: true,
    freezeTableName: true,
    modelName: "companyFormations",
    hooks: {
      beforeValidate: async (company) => {
        const currentDate = getCurrentDate();
        const code = "CFO";
        const lastPan = await CompanyFormations.findOne({
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

        company.workId = `${currentDate}${code}${newIncrement}`;
      },
    },
  }
)

module.exports = CompanyFormations;