// associations.js (ví dụ bạn đặt tên file này)

import Account from './Account.js';
import Product from './Product.js';
import Order from './Order.js';
import DownloadFile from './DownloadFile.js';
import Image from './Image.js';

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
    as: 'orderedProduct'  // bạn có thể đổi tên alias này nếu muốn, nhớ đồng bộ trong include
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
