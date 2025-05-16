const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('shopdb', 'root', '123456', {
  host: 'localhost',
  dialect: 'mariadb',
});

module.exports = sequelize;
