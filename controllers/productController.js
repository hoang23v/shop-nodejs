import Product from '../models/Product.js';
import path from 'path';
import fs from 'fs';
import Image from '../models/Image.js';

const createProduct = async (req, res) => {
  try {
    const { name, description, price, stock } = req.body;

    if (!name || !price || stock == null) {
      return res.status(400).json({ message: 'Thiếu thông tin' });
    }

    const product = await Product.create({ name, description, price, stock });

    if (req.files && req.files.length > 0) {
      const imagesData = req.files.map(file => ({
        filename: file.filename,
        productId: product.id,
      }));
      await Image.bulkCreate(imagesData);
    }

    const productWithImages = await Product.findByPk(product.id, {
      include: [{ model: Image, as: 'images' }]
    });

    res.status(201).json(productWithImages);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Lỗi server' });
  }
};



const getAllProducts = async (req, res) => {
  try {
    const searchQuery = req.query.search;

    const whereCondition = searchQuery
      ? where(fn('LOWER', col('name')), {
          [Op.like]: `%${searchQuery.toLowerCase()}%`
        })
      : undefined;

    const products = await Product.findAll({
      where: whereCondition,
      include: [{ model: Image, as: 'images' }]
    });

    res.render('productList', { products });
  } catch (err) {
    console.error('Lỗi khi lấy danh sách sản phẩm:', err);
    res.status(500).send('Lỗi server');
  }
};

const deleteProduct = async (req, res) => {
  try {
    const id = req.params.id;

    const product = await Product.findByPk(id, {
      include: [{ model: Image, as: 'images' }]
    });
    if (!product) {
      return res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
    }

    // Xoá file ảnh thật
    if (product.images && product.images.length > 0) {
      product.images.forEach(image => {
        const imagePath = path.join(path.dirname(new URL(import.meta.url).pathname), '../uploads', image.filename);
        fs.unlink(imagePath, err => {
          if (err) console.warn('Xoá ảnh lỗi hoặc ảnh không tồn tại:', err.message);
        });
      });
    }

    // Xoá bản ghi ảnh trong DB
    await Image.destroy({ where: { productId: id } });

    // Xoá sản phẩm
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
     const product = await Product.findByPk(id, {
       include: [{ model: Image, as: 'images' }]
     });

     if (!product) {
       return res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
     }
     res.json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi server khi lấy thông tin sản phẩm' });
  }
}

export { createProduct, getAllProducts, deleteProduct, getProductById };
