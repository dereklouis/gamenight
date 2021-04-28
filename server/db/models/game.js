const Sequelize = require('sequelize');
const db = require('../db');

const Game = db.define('game', {
  name: Sequelize.STRING,
  path: Sequelize.STRING,
  voteCount: {
    type: Sequelize.INTEGER,
    defaultValue: 0,
    validations: {
      min: 0,
    },
  },
});

module.exports = Game;
