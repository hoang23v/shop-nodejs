const Product = require('../models/Product');
const path = require('path');
const fs = require('fs');

const createProduct = async (req, res) => {
  try {
    const { name, description, price, stock } = req.body;
    const image = req.file ? req.file.filename : null;

    if (!name || !price || stock == null) {
      return res.status(400).json({ message: 'Thiếu thông tin' });
    }

    const product = await Product.create({ name, description, price, stock, image });
    res.status(201).json(product);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

const getAllProducts = async (req, res) => {
  try {
    const products = await Product.findAll();
    res.json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const id = req.params.id;

    const product = await Product.findByPk(id);
    if (!product) {
      return res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
    }

    if (product.image) {
      const imagePath = path.join(__dirname, '../uploads', product.image);
      fs.unlink(imagePath, (err) => {
        if (err) console.warn('Xoá ảnh lỗi hoặc ảnh không tồn tại:', err.message);
      });
    }

    await product.destroy();

    res.json({ message: 'Đã xoá sản phẩm thành công' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi server khi xoá sản phẩm' });
  }
};

const getProductById = async (req, res) => {
  try {
     const id = req.params.id;
     const product = await Product.findByPk(id);

     if (!product) {
       return res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
     }
      res.json(product); 
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi server khi lấy thông tin sản phẩm' });
  }
}

module.exports = { createProduct, getAllProducts, deleteProduct, getProductById };
