import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Image = sequelize.define('Image', {
  productId: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  filename: {
    type: DataTypes.STRING,
    allowNull: false,
  }
}, {
  tableName: 'Images',
  timestamps: true,
});


export default Image;