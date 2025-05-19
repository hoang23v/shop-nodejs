import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Account = sequelize.define('Account', {
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  balance: {
    type: DataTypes.FLOAT,
    allowNull: false,
    defaultValue: 0,
  },
  purchasedServices: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: [],
  },
  isAdmin: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false, 
  },
}, {
  tableName: 'Accounts',
  timestamps: true,
});

export default Account;