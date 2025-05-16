const express = require('express');
const router = express.Router();
const upload = require('../middlewares/upload');
const Product = require('../models/Product');
const Image = require('../models/Image');  // Bạn cần import model Image

router.get('/add-product', (req, res) => {
  res.render('admin/add-product'); 
});

router.post('/add-product', upload.array('images', 5), async (req, res) => {
  try {
    const { name, description, price, stock } = req.body;

    // Tạo product
    const product = await Product.create({ name, description, price, stock });

    // Lưu images nếu có file
    if (req.files && req.files.length > 0) {
      const images = req.files.map(file => ({
        filename: file.filename,
        productId: product.id
      }));

      await Image.bulkCreate(images);
    }

    res.redirect('/');
  } catch (err) {
    console.error(err);
    res.status(500).send('Lỗi server');
  }
});

module.exports = router;
