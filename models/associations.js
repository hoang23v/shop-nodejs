import sequelize from '../config/database.js';
import { DataTypes, Model } from 'sequelize';

// Import models
import Account from './Account.js';
import Product from './Product.js';
import Order from './Order.js';
import DownloadFile from './DownloadFile.js';
import Image from './Image.js';

// Initialize models
// (This is only necessary if you're defining models here instead of in separate files)

// Define associations
function initializeAssociations() {
  // Product associations
  Product.hasOne(DownloadFile, { 
    foreignKey: 'productId', 
    as: 'downloadFile',
    onDelete: 'CASCADE'
  });
  
  Product.hasMany(Image, { 
    foreignKey: 'productId', 
    as: 'images',
    onDelete: 'CASCADE' 
  });
  
  // DownloadFile associations
  DownloadFile.belongsTo(Product, { 
    foreignKey: 'productId', 
    as: 'product' 
  });
  
  // Image associations
  Image.belongsTo(Product, { 
    foreignKey: 'productId', 
    as: 'product' 
  });
  
  // Order associations
  Order.belongsTo(Product, { 
    foreignKey: 'productId', 
    as: 'orderedProduct' 
  });
  
  Order.belongsTo(Account, { 
    foreignKey: 'userId', 
    as: 'account' 
  });
  
  Account.hasMany(Order, { 
    foreignKey: 'userId', 
    as: 'orders' 
  });
}

export default initializeAssociations;