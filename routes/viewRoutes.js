const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

router.get('/', async (req, res) => {
  const products = await Product.findAll();
  res.render('products', { products });
});

router.get('/product/:id', async (req, res) => {
  const product = await Product.findByPk(req.params.id);
  if (!product) return res.status(404).send('Không tìm thấy sản phẩm');
  res.render('product-detail', { product });
});

module.exports = router;
