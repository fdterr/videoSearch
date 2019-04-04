const Sequelize = require('sequelize');
const db = require('../db');

const Player = db.define('player', {
  playerId: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  fullName: {
    type: Sequelize.STRING,
    allowNull: false
  },
  team: {
    type: Sequelize.INTEGER,
    allowNull: true
  },
  season: {
    type: Sequelize.INTEGER,
    allowNull: true
  }
});

module.exports = Player;
