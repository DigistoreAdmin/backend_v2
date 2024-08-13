const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const Session = sequelize.define('Session', {
  sid: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
  sess: {
    type: DataTypes.JSON,
    allowNull: false,
  },
  expire: {
    type: DataTypes.DATE,
    allowNull: false,
  },
}, {
  tableName: 'session',
  timestamps: false,
});

module.exports = Session;
