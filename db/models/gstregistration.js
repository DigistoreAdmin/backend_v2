"use strict";
const { Model, DataTypes ,Op} = require("sequelize");
const sequelize = require("../../config/database");

const getCurrentDate = () => {
  const date = new Date();
  return `${date.getDate().toString().padStart(2, "0")}${(date.getMonth() + 1)
    .toString()
    .padStart(2, "0")}${date.getFullYear()}`;
};

const gstRegistrationDetails = (typeOfBusiness) => {

  const proprietaryAndPartnershipNullVal = ["proprietary", "partnership"].includes(typeOfBusiness) ? false : true;
  const PartnershipAndCompanypNullVal = ["partnership", "company"].includes(typeOfBusiness) ? false : true;
  const proprietaryNullVal = typeOfBusiness === "proprietary" ? false : true;
  const partnershipNullVal = typeOfBusiness === "partnership" ? false : true;
  const companyNullVal = typeOfBusiness === "company" ? false : true;

  const gstRegistration = sequelize.define(
    'gstRegistrations',
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
      },
      status: {
        type: DataTypes.ENUM("inQueue", "inProgress", "completed","rejected"),
        allowNull: false,
        defaultValue: "inQueue",
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
        allowNull: false,
        validate: {
          notNull: {
            msg: 'Email id cannot be null',
          },
          notEmpty: {
            msg: 'Email id cannot be empty',
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
      phoneNumber: {
        type: DataTypes.STRING,
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
      applicationReferenceNumber: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      commissionToHO: {
        type: DataTypes.DECIMAL,
        allowNull: true,
      },
      commissionToFranchise: {
        type: DataTypes.DECIMAL,
        allowNull: true,
      },
      totalAmount: {
        type: DataTypes.DECIMAL,
        allowNull: true,
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
      pinCode: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: 'Pin code cannot be null',
          },
          notEmpty: {
            msg: 'Pin code cannot be empty',
          },
          isNumeric: {
            msg: 'Pin code must be numeric',
          },
          len: {
            args: [6, 6],
            msg: 'Pin code must be exactly 6 digits',
          },
        },
      },
      building: {
        type: DataTypes.ENUM('owned', 'rent/leased'),
        allowNull: false,
        defaultValue: 'owned',
        validate: {
          notNull: {
            msg: 'Building type cannot be null',
          },
          notEmpty: {
            msg: 'Building type cannot be empty',
          },
        },
      },
      shopLatitude: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: 'Shop latitude cannot be null',
          },
          notEmpty: {
            msg: 'Shop latitude cannot be empty',
          },
          isDecimal: {
            msg: 'Shop latitude must be a decimal number',
          },
          isFloat: {
            msg: 'Shop latitude must be a valid float number',
          },
        },
      },
      shopLongitude: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: 'Shop longitude cannot be null',
          },
          notEmpty: {
            msg: 'Shop longitude cannot be empty',
          },
          isDecimal: {
            msg: 'Shop longitude must be a decimal number',
          },
          isFloat: {
            msg: 'Shop longitude must be a valid float number',
          },
        },
      },
      typeOfBusiness: {
        type: DataTypes.ENUM('proprietary', 'partnership', 'company'),
        allowNull: false,
        validate: {
          notNull: {
            msg: 'Business type cannot be null',
          },
          notEmpty: {
            msg: 'Business type cannot be empty',
          },
        },
      },
      panPic: {
        type: DataTypes.STRING,
        allowNull: proprietaryNullVal,
        validate: {
          isUrl: {
            msg: 'Pan card image must be a valid URL',
          },
        },
      },
      gstDocument: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      aadhaarFront: {
        type: DataTypes.STRING,
        allowNull: proprietaryNullVal,
        validate: {
          isUrl: {
            msg: 'Aadhaar front image must be a valid URL',
          },
        },
      },
      aadhaarBack: {
        type: DataTypes.STRING,
        allowNull: proprietaryNullVal,
        validate: {
          isUrl: {
            msg: 'Aadhaar back image must be a valid URL',
          },
        },
      },
      buildingTaxReceipt: {
        type: DataTypes.STRING,
        allowNull: proprietaryNullVal,
        validate: {
          isUrl: {
            msg: 'Building tax receipt must be a valid URL',
          },
        },
      },
      rentAgreement: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
          isUrl: {
            msg: 'Rent agreement must be a valid URL',
          },
        },
      },
      photo: {
        type: DataTypes.STRING,
        allowNull: proprietaryNullVal,
        validate: {
          isUrl: {
            msg: 'Photo must be a valid URL',
          },
        },
      },
      bankDetails: {
        type: DataTypes.STRING,
        allowNull: proprietaryAndPartnershipNullVal,
        validate: {
          isUrl: {
            msg: 'Bank details must be a valid URL',
          },
        },
      },
      landTaxReceipt: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
          isUrl: {
            msg: 'Land tax receipt must be a valid URL',
          },
        },
      },
      // shopGmapPic: {
      //   type: DataTypes.STRING,
      //   allowNull: proprietaryNullVal,
      //   validate: {
      //     isUrl: {
      //       msg: 'Shop Google Map picture must be a valid URL',
      //     },
      //   },
      // },
      residenceLatitude: {
        type: DataTypes.STRING,
        allowNull: proprietaryNullVal,
        validate: {
          isDecimal: {
            msg: 'Residence latitude must be a decimal number',
          },
        },
      },
      residenceLongitude: {
        type: DataTypes.STRING,
        allowNull: proprietaryNullVal,
        validate: {
          isDecimal: {
            msg: 'Residence longitude must be a decimal number',
          },
        },
      },
      noOfPartners: {
        type: DataTypes.INTEGER,
        allowNull: partnershipNullVal,
        validate: {
          isInt: {
            msg: 'Number of partners must be an integer',
          },
          min: {
            args: [1],
            msg: 'Number of partners must be at least 1',
          },
        },
      },
      partnersDetails: {
        type: DataTypes.JSONB,
        allowNull: partnershipNullVal,
        validate: {
          // Custom validation function
          isValidPartnersDetails(value) {
            // Allow null values if `partnershipNullVal` is true
            if (partnershipNullVal) {
              return;
            }

            // Check if the value is an array and not empty
            if (!Array.isArray(value) || value.length === 0) {
              throw new Error('Partners details must be a non-empty array');
            }

            // Validate each item in the array
            value.forEach((partner) => {
              const {
                panPic, photo, aadhaarFront, aadhaarBack, addressLine1, pinCode, latitude, longitude
              } = partner;

              // Check photo, panPic, aadhaarFront, aadhaarBack URLs
              const urlRegex = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i;
              if (!urlRegex.test(photo) || !urlRegex.test(aadhaarFront) || !urlRegex.test(aadhaarBack) || !urlRegex.test(panPic)) {
                throw new Error('Photo, panPic, Aadhaar Front, and Aadhaar Back must be valid URLs');
              }

              // Check address (non-empty string)
              if (typeof addressLine1 !== 'string' || addressLine1.trim() === '') {
                throw new Error('Address must be a non-empty string');
              }

              // Check pincode (valid format)
              const pincodeRegex = /^\d{6}$/; // Adjust this regex if your pincode format is different
              if (!pincodeRegex.test(pinCode)) {
                throw new Error('Pincode must be a 6-digit number');
              }

              // Check latitude and longitude (valid decimal numbers)
              const decimalRegex = /^-?\d+(\.\d+)?$/;
              if (!decimalRegex.test(latitude) || !decimalRegex.test(longitude)) {
                throw new Error('Latitude and Longitude must be valid decimal numbers');
              }
            });
          },
        },
      },


      partnershipDeed: {
        type: DataTypes.STRING,
        allowNull: partnershipNullVal,
        validate: {
          isUrl: {
            msg: 'Partnership deed must be a valid URL',
          },
        },
      },
      noObjectionCertificate: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
          isUrl: {
            msg: 'No objection certificate must be a valid URL',
          },
        },
      },
      propertyTaxReceipt: {
        type: DataTypes.STRING,
        allowNull: PartnershipAndCompanypNullVal,
        validate: {
          isUrl: {
            msg: 'Property tax receipt must be a valid URL',
          },
        },
      },
      noOfDirectors: {
        type: DataTypes.INTEGER,
        allowNull: companyNullVal,
        validate: {
          isInt: {
            msg: 'Number of directors must be an integer',
          },
          min: {
            args: [1],
            msg: 'Number of directors must be at least 1',
          },
        },
      },
      directorsDetails: {
        type: DataTypes.JSONB,
        allowNull: companyNullVal,
        validate: {
          // Custom validation function
          isValidDirectorDetails(value) {
            // Allow null values if `companyNullVal` is true
            if (companyNullVal) {
              return;
            }

            // Check if the value is an array and not empty
            if (!Array.isArray(value) || value.length === 0) {
              throw new Error('Directors details must be a non-empty array');
            }

            // Validate each item in the array
            value.forEach((director) => {
              const { panPic, photo, aadhaarBack, aadhaarFront, addressLine1, latitude, longitude, pinCode } = director;
              if (!panPic || !photo || !addressLine1 || !latitude || !longitude || !pinCode || !aadhaarBack || !aadhaarFront) {
                throw new Error('Direcors fields are missing');
              }

              // Check photo and panPic URLs
              const urlRegex = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i;
              if (!urlRegex.test(photo) || !urlRegex.test(panPic) || !urlRegex.test(aadhaarBack) || !urlRegex.test(aadhaarFront)) {
                throw new Error('Photo ,aadhaarBack,aadhaarFront, PAN Card must be valid URLs');
              }

              // Check address (non-empty string)
              if (typeof addressLine1 !== 'string' || addressLine1.trim() === '') {
                throw new Error('Address must be a non-empty string');
              }
              console.log(latitude,longitude);
              // Check latitude and longitude (valid decimal numbers)
              const decimalRegex = /^-?\d+(\.\d+)?$/;
              if (!decimalRegex.test(latitude) || !decimalRegex.test(longitude)) {
                throw new Error('Latitude and Longitude must be valid decimal numbers');
              }

            });
          },
        },
      },
      incorporationCertificate: {
        type: DataTypes.STRING,
        allowNull: companyNullVal,
        validate: {
          isUrl: {
            msg: 'Incorporation certificate must be a valid URL',
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
      modelName: 'gstRegistrations',
      hooks: {
        beforeValidate: async (gst) => {
          const currentDate = getCurrentDate();
          const code = "GST";
          const lastGst = await gstRegistration.findOne({
            where: {
              workId: {
                [Op.like]: `${currentDate}${code}%`,
              },
            },
            order: [["createdAt", "DESC"]],
          });

          let newIncrement = "001";
          if (lastGst) {
            const lastIncrement = parseInt(lastGst.workId.slice(-3));
            newIncrement = (lastIncrement + 1).toString().padStart(3, "0");
          }

          gst.workId = `${currentDate}${code}${newIncrement}`;
        },
      },
    }
  );

  return gstRegistration;
}

module.exports = gstRegistrationDetails;
