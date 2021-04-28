const Sequelize = require('sequelize');
const db = require('../db');

const User = db.define('user', {
  name: Sequelize.STRING,
  votesRemaining: {
    type: Sequelize.INTEGER,
    defaultValue: 3,
    validations: {
      min: 0,
      max: 3,
    },
  },
  attending: {
    type: Sequelize.STRING,
    defaultValue: 'n/a',
  },
});

module.exports = User;
