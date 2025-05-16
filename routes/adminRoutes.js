const express = require('express');
const router = express.Router();
const upload = require('../middlewares/upload');
const Product = require('../models/Product');

router.get('/add-product', (req, res) => {
  res.render('admin/add-product'); 
});

router.post('/add-product', upload.single('image'), async (req, res) => {
  try {
    const { name, description, price, stock } = req.body;
    const image = req.file ? req.file.filename : null;

    if (!name || !price || stock == null) {
      return res.status(400).send('Thiếu thông tin');
    }

    await Product.create({ name, description, price, stock, image });
    res.redirect('/');
  } catch (err) {
    console.error(err);
    res.status(500).send('Lỗi server');
  }
});

module.exports = router;
