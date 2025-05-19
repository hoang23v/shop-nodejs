import { Sequelize } from 'sequelize';

const sequelize = new Sequelize('shopdb', 'root', '123456', {
  host: 'localhost',
  dialect: 'mariadb',
});

export default sequelize;
