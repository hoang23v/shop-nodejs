import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import DownloadFile from './DownloadFile.js';

const Product = sequelize.define('Product', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  price: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  stock: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  // Add any other product fields you might need
}, {
  tableName: 'Products',
  timestamps: true,
});

export default Product;