'use strict';
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

const definePancardUser = (panType, isCollege, isDuplicateOrChangePan) => {
  console.log(panType);

  const allowNullForNewPan = panType === "newPancard" ? false : true
  const allowN = isCollege === 'true' ? false : true;
  
  const allows = isDuplicateOrChangePan === 'duplicate' ? false : true;
  const allowsNew = isDuplicateOrChangePan === 'change' ? false : true;
  const allowNullVe = panType === "duplicateOrChangePancard" ? false : true;
  const allow = panType === "minorPancard" ? false : true;
  const allowNullV = panType === "NRIPancard" ? false : true;

  const PancardUser = sequelize.define('pancardUser', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    panType: {
        type: DataTypes.ENUM('newPancard', 'duplicateOrChangePancard', 'minorPancard', 'NRIPancard'),
        allowNull: false,
        validate: {
          isIn: {
            args: [['newPancard', 'duplicateOrChangePancard', 'minorPancard', 'NRIPancard']],
            msg: 'Invalid panType value'
          }
        }
      },
    uniqueId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('inQueue', 'inProgress', 'completed'),
      allowNull: false,
      defaultValue: 'inQueue',
    },
    assignedId: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    assignedOn: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: DataTypes.NOW,
    },
    completedOn: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: DataTypes.NOW,
    },
    customerName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Customer name cannot be empty'
        }
      }
    },
    emailID: {
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
          msg: 'Email address must be in a valid format (example@example.com)',
        },
      },
    },
    mobileNumber: {
      type: DataTypes.BIGINT,
      allowNull: false,
      validate: {
        isInt: {
          msg: 'Mobile number must be an integer'
        },
        len: {
          args: [10, 10],
          msg: 'Mobile number must be 10 digits'
        }
      }
    },
    fatherName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Father name cannot be empty'
        },
        isValidName(value) {
          if (/\b[A-Z]\.?\s*[A-Z]?\.?\b/.test(value)) {
            throw new Error('Father name cannot contain initials');
          }
        }
      }
    },
    proofOfIdentity: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    proofOfDOB: {
      type: DataTypes.STRING,
      allowNull:false,
    },
    proofOfAddress: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    // Fields specific to 'new' PAN
    isCollege: {
      type: DataTypes.BOOLEAN,
      allowNull: allowNullForNewPan,
      defaultValue:false,
      validate: {
        isIn: {
          args: [[true, false]],
          msg: 'isCollege value must be true or false',
        },
      },
    },
    collegeID: {
      type: DataTypes.STRING,
      allowNull: allowN,
    },
    coordinatorID: {
      type: DataTypes.STRING,
      allowNull: allowN,
    },
    coordinatorName: {
      type: DataTypes.STRING,
      allowNull: allowN,
    },

    isDuplicateOrChangePan: {
      type: DataTypes.ENUM('duplicate', 'change'),
      allowNull: allowNullVe,
      validate: {
        isIn: {
          args: [['duplicate', 'change']],
         msg: 'value must be duplicate or change'
        }
      }
    },

    panNumber: {
      type: DataTypes.STRING,
      allowNull: allowNullVe,
    },

    // Fields specific to 'duplicate' PAN
    reasonForDuplicate: {
      type: DataTypes.STRING,
      allowNull: allows,
    },

    // Fields specific to 'change' PAN

    nameChange: {
      type: DataTypes.STRING,
      allowNull: allowsNew,
    },
    addressChange: {
      type: DataTypes.STRING,
      allowNull: allowsNew,
    },
    dobChange: {
      type: DataTypes.STRING,
      allowNull: allowsNew,
    },
    signatureChange: {
      type: DataTypes.STRING,
      allowNull: allowsNew,
    },
    photoChange: {
      type: DataTypes.STRING,
      allowNull: allowsNew,
    },
    changeFatherName:{
      type: DataTypes.STRING,
      allowNull: allowsNew,
    },

    // Fields specific to 'minor' PAN
    representativeName: {
      type: DataTypes.STRING,
      allowNull: allow,
    },
    representativeAddress: {
        type: DataTypes.STRING,
        allowNull:allow,
      },
      representativeRelatiion:{
        type: DataTypes.STRING,
        allowNull: allow,
      },
      representativeDocument: {
        type: DataTypes.STRING,
        allowNull: allow,
      },

    // Field specific to 'NRI' PAN
    nriAddress: {
      type: DataTypes.STRING,
      allowNull: allowNullV,
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    deletedAt: {
      type: DataTypes.DATE
    }
  }, {
    paranoid: true,
    freezeTableName: true,
    modelName: 'pancardUser'
  });

  return PancardUser;
};

module.exports = definePancardUser;