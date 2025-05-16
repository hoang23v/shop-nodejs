const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Product = require('./Product');

const Image = sequelize.define('Image', {
  filename: { type: DataTypes.STRING, allowNull: false },
  productId: {
    type: DataTypes.INTEGER,
    references: {
      model: 'Products', // Hoặc Product nếu không dùng chuỗi
      key: 'id'
    },
    onDelete: 'CASCADE',
    allowNull: false
  }
});

// Thiết lập quan hệ 1-n giữa Product và Image
Product.hasMany(Image, { as: 'images', foreignKey: 'productId' });
Image.belongsTo(Product, { foreignKey: 'productId' });

module.exports = Image;
