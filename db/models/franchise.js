'use strict';
const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');
const AppError = require('../../utils/appError');
const userPlans = require('./userplan');
const bcrypt = require('bcrypt');
const crypto = require('crypto');

const Franchise = sequelize.define(
    'franchises',
    {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER,
        },
        franchiseUniqueId: {
            allowNull: false,
            type: DataTypes.STRING,
        },
        userType: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: 'franchise',
            validate: {
                notNull: {
                    msg: 'User type cannot be null',
                },
                notEmpty: { 
                    msg: 'User type cannot be empty',
                },
            },
        },
        ownerName: {
            type: DataTypes.STRING, 
            allowNull: false,
            validate: {
                notNull: {
                    msg: 'Owner name cannot be null',
                },
                notEmpty: {
                    msg: 'Owner name cannot be empty',
                },
            },
        },
        franchiseName: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notNull: {
                    msg: 'Franchise name cannot be null',
                },
                notEmpty: {
                    msg: 'Franchise name cannot be empty',
                },
            },
        },
        businessType: {
            type: DataTypes.STRING,
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
                isInt: {
                    msg: 'Phone number must be an integer',
                },
                len: {
                    args: [10, 10],
                    msg: 'Phone number must be exactly 10 digits',
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
                    msg: 'Invalid email format',
                },
            },
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notNull: {
                    msg: 'Password cannot be null',
                },
                notEmpty: {
                    msg: 'Password cannot be empty',
                },
                len: {
                    args: [8],
                    msg: "Password must be at least 8 characters",
                  },
            },
        }, 
        gender: {
          type: DataTypes.ENUM,
          values: ['male', 'female', 'other'],
          allowNull: false,
          validate: {
            notNull: {
              msg: 'Gender cannot be null',
            },
            notEmpty: {
              msg: 'Gender cannot be empty',
            },
          },
        },
        dateOfBirth: {
            type: DataTypes.DATE,
            allowNull: false,
            validate: {
                notNull: {
                    msg: 'Date of birth cannot be null',
                },
                notEmpty: {
                    msg: 'Date of birth cannot be empty',
                },
            },
        },
        franchiseAddressLine1: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notNull: {
                    msg: 'Address line 1 cannot be null',
                },
                notEmpty: {
                    msg: 'Address line 1 cannot be empty',
                },
            },
        },
        franchiseAddressLine2: {
            type: DataTypes.STRING,
        },
        state: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notNull: {
                    msg: 'State cannot be null',
                },
                notEmpty: {
                    msg: 'State cannot be empty',
                },
            },
        },
        district: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notNull: {
                    msg: 'District cannot be null',
                },
                notEmpty: {
                    msg: 'District cannot be empty',
                },
            },
        },
        pinCode: {
            type: DataTypes.BIGINT,
            allowNull: false,
            validate: {
                notNull: {
                    msg: 'Pin code cannot be null',
                },
                notEmpty: {
                    msg: 'Pin code cannot be empty',
                },
                isInt: {
                    msg: 'Pin code must be an integer',
                },
            },
        },
        postOffice: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notNull: {
                    msg: 'Post office cannot be null',
                },
                notEmpty: {
                    msg: 'Post office cannot be empty',
                },
            },
        },
        panchayath: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notNull: {
                    msg: 'Panchayath cannot be null',
                },
                notEmpty: {
                    msg: 'Panchayath cannot be empty',
                },
            },
        },
        ward: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notNull: {
                    msg: 'Ward cannot be null',
                },
                notEmpty: {
                    msg: 'Ward cannot be empty',
                },
            },
        },
        digitalElements: {
            type: DataTypes.JSON,
            allowNull: true,
            validate: {
                isValidDigitalElements(value) {
                    console.log("nnnnnnn", value);
                    console.log("nnnnnnn", typeof(value));
        
                    // Convert string to array if it's a string
                    if (typeof value === 'string') {
                        try {
                            // Handle strings without proper JSON formatting
                            value = value
                                .replace(/[\[\]']+/g, '') // Remove square brackets and single quotes
                                .split(',') // Split by commas to create an array
                                .map(item => item.trim()); // Trim whitespace
                        } catch (error) {
                            throw new Error('Digital elements must be a valid JSON array');
                        }
                    } 
        
                    if (this.panCenter) {
                        if (!Array.isArray(value) || value.length === 0) {
                            throw new Error('Digital elements must be a non-empty array when Pan Center is true');
                        }
                        value.forEach(element => {
                            if (typeof element !== 'string') {
                                throw new Error('Each digital element must be a string');
                            }
                        });
                    } else {
                        this.digitalElements = {};
                    }
                },
            },
        },
        
        panCenter: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            validate: {
                notNull: {
                    msg: 'Pan center cannot be null',
                },
            },
        },
        accountNumber: {
            type: DataTypes.STRING,
            allowNull: true,
            // validate: {
            //     notNull: {
            //         msg: 'Account number cannot be null',
            //     },
            //     notEmpty: {
            //         msg: 'Account number cannot be empty',
            //     },
            //     isInt: {
            //         msg: 'Account number must be an integer',
            //     },
            // },
        },
        accountName: {
            type: DataTypes.STRING,
            allowNull: true,
            // validate: {
            //     notNull: {
            //         msg: 'Account name cannot be null',
            //     },
            //     notEmpty: {
            //         msg: 'Account name cannot be empty',
            //     },
            // },
        },
        bank: {
            type: DataTypes.STRING,
            allowNull: true,
            // validate: {
            //     notNull: {
            //         msg: 'Bank name cannot be null',
            //     },
            //     notEmpty: {
            //         msg: 'Bank name cannot be empty',
            //     },
            // },
        },
        branchName: {
            type: DataTypes.STRING,
            allowNull: true,
            // validate: {
            //     notNull: {
            //         msg: 'Branch name cannot be null',
            //     },
            //     notEmpty: {
            //         msg: 'Branch name cannot be empty',
            //     },
            // },
        },
        ifscCode: {
            type: DataTypes.STRING,
            allowNull: true,
            // validate: {
            //     notNull: {
            //         msg: 'IFSC code cannot be null',
            //     },
            //     notEmpty: {
            //         msg: 'IFSC code cannot be empty',
            //     },
            // },
        },
        aadhaarNumber: {
            type: DataTypes.STRING,
            allowNull: true,
            // validate: {
            //     notNull: {
            //         msg: 'Aadhaar number cannot be null',
            //     },
            //     notEmpty: {
            //         msg: 'Aadhaar number cannot be empty',
            //     },
            //     isInt: {
            //         msg: 'Aadhaar number must be an integer',
            //     },
            // },
        },
        panNumber: {
            type: DataTypes.STRING,
            allowNull: true,
            // validate: {
            //     notNull: {
            //         msg: 'PAN number cannot be null',
            //     },
            //     notEmpty: {
            //         msg: 'PAN number cannot be empty',
            //     },
            // },
        },
        aadhaarPicFront: {
            type: DataTypes.STRING,
            allowNull: true,
            // validate: {
            //     notNull: {
            //         msg: 'Aadhaar front picture cannot be null',
            //     },
            //     notEmpty: {
            //         msg: 'Aadhaar front picture cannot be empty',
            //     },
            // },
        },
        aadhaarPicback: {
            type: DataTypes.STRING,
            allowNull: true,
            // validate: {
            //     notNull: {
            //         msg: 'Aadhaar back picture cannot be null',
            //     },
            //     notEmpty: {
            //         msg: 'Aadhaar back picture cannot be empty',
            //     },
            // },
        },
        panPic: {
            type: DataTypes.STRING,
            allowNull: true,
            // validate: {
            //     notNull: {
            //         msg: 'PAN picture cannot be null',
            //     },
            //     notEmpty: {
            //         msg: 'PAN picture cannot be empty',
            //     },
            // },
        },
        bankPassbookPic: {
            type: DataTypes.STRING,
            allowNull: true,
            // validate: {
            //     notNull: {
            //         msg: 'Bank passbook picture cannot be null',
            //     },
            //     notEmpty: {
            //         msg: 'Bank passbook picture cannot be empty',
            //     },
            // },
        },
        shopPic: {
            type: DataTypes.STRING,
            allowNull: true,
            // validate: {
            //     notNull: {
            //         msg: 'Shop picture cannot be null',
            //     },
            //     notEmpty: {
            //         msg: 'Shop picture cannot be empty',
            //     },
            // },
        },
        referredBy: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
        referredFranchiseName: {
            type: DataTypes.STRING,
            allowNull: true, // conditional based on referredBy
        },
        referredFranchiseCode: {
            type: DataTypes.STRING,
            allowNull: true, // conditional based on referredBy
        },
        onBoardedBy: {
            type: DataTypes.ENUM('distributor', 'fieldExecutive', 'teleCaller', 'collegeQuest', 'itsSelf','admin'),
            allowNull: false,
            defaultValue: 'itsSelf',
        },
        onBoardedPersonId: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        onBoardedPersonName: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        blocked:{
            type: DataTypes.ENUM("blocked","unBlocked"),
            allowNull: false,
            defaultValue:"unBlocked"
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
        userPlan: {
            type: DataTypes.ENUM('free', 'paid'), 
            allowNull: false,
            defaultValue: 'free', 
        },
        blocked:{
            type: DataTypes.ENUM("blocked","unBlocked"),
            allowNull: false,
            defaultValue:"unBlocked"
          },
    },
    {
        paranoid: true,
        freezeTableName: true,
        modelName: 'franchises',
    }
);

Franchise.hasMany(userPlans, { foreignKey: 'planId' });
userPlans.belongsTo(Franchise, {
    foreignKey: 'planId',
});

module.exports = Franchise;

Franchise.beforeCreate(async (franchise) => {
    console.log("lllwsds");
    if (franchise.password && typeof franchise.password === 'string') {
        franchise.password = await bcrypt.hash(franchise.password, 8);
    }
    if (franchise.panNumber && typeof franchise.panNumber === 'string') {
        franchise.panNumber = await bcrypt.hash(franchise.panNumber, 8);
    }

    if (franchise.aadhaarNumber && typeof franchise.aadhaarNumber === 'number') {
        franchise.aadhaarNumber = await bcrypt.hash(franchise.aadhaarNumber.toString(), 8);
    }

    if (franchise.accountNumber && typeof franchise.accountNumber === 'number') {
        franchise.accountNumber = await bcrypt.hash(franchise.accountNumber.toString(), 8);
    }
});

Franchise.prototype.isPasswordMatch = async function(password) {
    try {
        return await bcrypt.compare(password, this.password);
    } catch (error) {
        console.error("Error comparing passwords:", error);
        throw new Error("Failed to compare passwords");
    }
};
