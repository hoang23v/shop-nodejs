import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database.js';

class DownloadFile extends Model {}

DownloadFile.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  productId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  googleDriveLink: {
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  sequelize,
  modelName: 'DownloadFile',
  tableName: 'DownloadFiles',
  timestamps: true
});

export default DownloadFile;
