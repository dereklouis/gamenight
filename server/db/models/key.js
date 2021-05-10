const Sequelize = require('sequelize');
const db = require('../db');

const Key = db.define('key', {
  link: Sequelize.STRING,
  roomCode: Sequelize.STRING,
  gameActive: {
    type: Sequelize.BOOLEAN,
    defaultValue: false,
  },
  availablePhotoIDs: {
    type: Sequelize.ARRAY(Sequelize.INTEGER),
    defaultValue: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
  },
});

module.exports = Key;
