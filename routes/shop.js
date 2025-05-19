import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import DownloadFile from '../models/DownloadFile.js';
import { sendProductEmail } from '../services/sendMail.js'; 

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Route mua hàng
router.post('/buy/:productId', async (req, res) => {
  try {
    const fakeUserId = 1;
    const userEmail = 'an.hiu.vlog@gmail.com';

    const product = await Product.findByPk(req.params.productId, {
      include: [{ model: DownloadFile, as: 'downloadFile' }],
    });

    if (!product) {
      return res.status(404).render('error', { message: 'Sản phẩm không tồn tại.' });
    }

    if (product.stock <= 0) {
      return res.status(400).render('error', { message: 'Sản phẩm đã hết hàng.' });
    }

    await Order.create({ userId: fakeUserId, productId: product.id });

    await product.decrement('stock'); // giảm số lượng

    await sendProductEmail(userEmail, product, product.downloadFile); // gửi email

    res.json({ message: 'Mua hàng thành công, email đã được gửi' });
    // res.redirect('/my-downloads');
  } catch (error) {
    console.error('Lỗi trong /buy:', error);
    res.status(500).render('error', { message: 'Lỗi server khi mua sản phẩm.' });
  }
});

// ✅ Route tải file mới theo productId + redirect đến googleDriveLink
router.get('/download/:productId', async (req, res) => {
  try {
    const fakeUserId = 1;
    const productId = req.params.productId;

    const order = await Order.findOne({
      where: { userId: fakeUserId, productId },
      include: [{
  model: DownloadFile,
  attributes: ['id', 'productId', 'googleDriveLink']
}],
    });

    if (!order) {
      return res.status(403).render('error', { message: 'Bạn không có quyền tải file này.' });
    }

    const file = order.Product.downloadFile;

    if (!file || !file.googleDriveLink) {
      return res.status(404).render('error', { message: 'Không tìm thấy link tải.' });
    }


    // res.redirect(file.googleDriveLink);
  } catch (error) {
    console.error('Lỗi trong /download:', error);
    res.status(500).render('error', { message: 'Lỗi server khi tải file.' });
  }
});

// Route danh sách file đã mua
router.get('/my-downloads', async (req, res) => {
  try {
    const fakeUserId = 1;
    const orders = await Order.findAll({
      where: { userId: fakeUserId },
      include: [
        {
          model: Product,
          include: [{ model: DownloadFile, as: 'downloadFile' }],
        },
      ],
    });

    res.render('my-downloads', { orders });
  } catch (error) {
    console.error('Lỗi trong /my-downloads:', error);
    res.status(500).render('error', { message: 'Lỗi server khi lấy danh sách tải về.' });
  }
});

export default router;
