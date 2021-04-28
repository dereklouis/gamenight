const Sequelize = require('sequelize');
const db = require('../db');

const Key = db.define('key', {
  link: Sequelize.STRING,
  roomCode: Sequelize.STRING,
  gameActive: {
    type: Sequelize.BOOLEAN,
    defaultValue: false,
  },
});

module.exports = Key;
