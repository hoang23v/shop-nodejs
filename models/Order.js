// models/Order.js
import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import Product from '../models/Product.js';

const Order = sequelize.define('Order', {
  userId: DataTypes.INTEGER,
  productId: DataTypes.INTEGER,
});

// Khai báo association (quan hệ)
Order.belongsTo(Product, { foreignKey: 'productId' });

// Nếu muốn, cũng khai báo ngược lại trong Product.js
// Product.hasMany(Order, { foreignKey: 'productId' });

export default Order;
