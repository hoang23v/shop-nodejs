import express from 'express';
import Product from '../models/Product.js';
import Image from '../models/Image.js';

const router = express.Router();
router.get('/', async (req, res) => {
  try {
    const products = await Product.findAll({
      include: [{ model: Image, as: 'images' }]
    });
    res.render('products', { products });
  } catch (error) {
    console.error('Lỗi khi lấy danh sách sản phẩm:', error);
    res.status(500).send('Lỗi server khi lấy sản phẩm');
  }
});

router.get('/product/:id', async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id, {
      include: [{ model: Image, as: 'images' }]
    });

    if (!product) return res.status(404).send('Không tìm thấy sản phẩm');

    res.render('product-detail', { product });
  } catch (error) {
    console.error('Lỗi khi lấy sản phẩm:', error);
    res.status(500).send('Lỗi server');
  }
});

export default router;
