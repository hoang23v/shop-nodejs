import express from 'express';
import upload from '../middlewares/upload.js';
import Product from '../models/Product.js';
import Image from '../models/Image.js';
import DownloadFile from '../models/DownloadFile.js';

const router = express.Router();

router.get('/add-product', (req, res) => {
  res.render('admin/add-product');
});

router.post('/add-product', upload.fields([
  { name: 'images', maxCount: 5 },
  { name: 'download', maxCount: 1 }
]), async (req, res) => {
  try {
    const { name, description, price, stock, googleDriveLink } = req.body;

    const priceNum = parseFloat(price);
    const stockNum = parseInt(stock, 10);

    if (!name || isNaN(priceNum) || isNaN(stockNum)) {
      return res.status(400).json({ success: false, message: 'Dữ liệu không hợp lệ' });
    }

    const product = await Product.create({ name, description, price: priceNum, stock: stockNum });

    if (req.files?.images) {
      const images = req.files.images.map(file => ({
        filename: file.filename,
        productId: product.id
      }));
      await Image.bulkCreate(images);
    }

    if (googleDriveLink && googleDriveLink.trim() !== '') {
      await DownloadFile.create({
        googleDriveLink: googleDriveLink.trim(),
        productId: product.id
      });
    } else if (req.files?.download && req.files.download.length > 0) {
      await DownloadFile.create({
        filename: req.files.download[0].filename,
        productId: product.id
      });
    }

    res.json({ success: true, message: 'Thêm sản phẩm thành công' });
  } catch (err) {
    console.error('Lỗi thêm sản phẩm:', err);
    res.status(500).json({ success: false, message: 'Lỗi server' });
  }
});



// Lấy danh sách sản phẩm
router.get('/products', async (req, res) => {
  try {
    const products = await Product.findAll();
    res.json(products);
  } catch (error) {
    console.error('Lỗi lấy sản phẩm:', error);
    res.status(500).json({ success: false, message: 'Lỗi server' });
  }
});

// Xóa sản phẩm
router.delete('/delete-product/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const product = await Product.findByPk(id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Sản phẩm không tồn tại' });
    }

    await product.destroy();
    res.json({ success: true, message: 'Xóa sản phẩm thành công' });
  } catch (error) {
    console.error('Lỗi xóa sản phẩm:', error);
    res.status(500).json({ success: false, message: 'Lỗi server' });
  }
});



export default router;
