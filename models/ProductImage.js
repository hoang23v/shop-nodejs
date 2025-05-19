import { DataTypes } from 'sequelize';

const defineProductImage = (sequelize) => {
  const ProductImage = sequelize.define('ProductImage', {
    filename: DataTypes.STRING,
  });

  ProductImage.associate = (models) => {
    ProductImage.belongsTo(models.Product, { foreignKey: 'productId', as: 'product' });
  };

  return ProductImage;
};

export default defineProductImage;
