import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { Op } from 'sequelize'; 
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import DownloadFile from '../models/DownloadFile.js';
import { sendProductEmail } from '../services/sendMail.js';
import { requireLogin } from '../middlewares/auth.js'; 
import Account from '../models/Account.js'; 
import sequelize from '../config/database.js';

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Route danh sách sản phẩm (home page)
router.get('/', async (req, res) => {
  try {
    const { search } = req.query;
    let products;

    if (search) {
      products = await Product.findAll({
        where: {
          name: {
            [Op.iLike]: `%${search}%`, 
          },
        },
        include: [
          { model: DownloadFile, as: 'downloadFile' },
          { model: Image, as: 'images' },
        ],
      });
    } else {
      products = await Product.findAll({
        include: [
          { model: DownloadFile, as: 'downloadFile' },
          { model: Image, as: 'images' },
        ],
      });
    }

    // res.locals.user đã được set bởi middleware setUser
    res.render('index', {
      products,
      search: search || '',
    });
  } catch (error) {
    console.error('Lỗi trong /:', error.message, error.stack);
    res.status(500).render('error', { message: 'Lỗi server khi lấy danh sách sản phẩm.' });
  }
});

router.post('/buy/:productId', requireLogin, async (req, res) => {
  try {
    const user = res.locals.user; // Lấy từ res.locals.user
    const product = await Product.findByPk(req.params.productId, {
      include: [{ model: DownloadFile, as: 'downloadFile' }],
    });

    if (!product) {
      return res.status(404).render('error', { message: 'Sản phẩm không tồn tại.' });
    }

    if (product.stock <= 0) {
      return res.status(400).render('error', { message: 'Sản phẩm đã hết hàng.' });
    }

    // Tìm tài khoản người dùng từ bảng accounts
    const account = await Account.findByPk(user.id);
    if (!account) {
      return res.status(404).render('error', { message: 'Tài khoản không tồn tại.' });
    }

    // Kiểm tra số dư (bỏ qua nếu là admin)
    if (!account.isAdmin && account.balance < product.price) {
      return res.status(400).render('error', { message: 'Số dư không đủ để mua sản phẩm.' });
    }

    // Bắt đầu transaction
    const t = await sequelize.transaction();

    try {
      // Tạo đơn hàng
      await Order.create({ userId: user.id, productId: product.id }, { transaction: t });

      // Giảm số lượng hàng
      await product.decrement('stock', { transaction: t });

      // Trừ tiền từ balance và cập nhật purchasedServices (bỏ qua trừ balance nếu là admin)
      const updatedPurchasedServices = account.purchasedServices
        ? [...account.purchasedServices, product.id]
        : [product.id];

      if (!account.isAdmin) {
        await account.update(
          {
            balance: account.balance - product.price,
            purchasedServices: updatedPurchasedServices,
          },
          { transaction: t }
        );
      } else {
        await account.update(
          { purchasedServices: updatedPurchasedServices },
          { transaction: t }
        );
      }

      // Commit transaction
      await t.commit();

      // Gửi email xác nhận
      await sendProductEmail(user.email, product, product.downloadFile);

      res.redirect('/my-downloads?purchased=true');
    } catch (error) {
      // Rollback transaction nếu có lỗi
      await t.rollback();
      throw error;
    }
  } catch (error) {
    console.error('Lỗi trong /buy:', error.message, error.stack);
    res.status(500).render('error', { message: 'Lỗi server khi mua sản phẩm.' });
  }
});
// Route tải file theo productId
router.get('/download/:productId', requireLogin, async (req, res) => {
  try {
    const user = res.locals.user;
    const productId = req.params.productId;

    const order = await Order.findOne({
      where: { userId: user.id, productId },
      include: [
        {
          model: Product,
          include: [{ model: DownloadFile, as: 'downloadFile' }],
        },
      ],
    });

    if (!order) {
      return res.status(403).render('error', { message: 'Bạn không có quyền tải file này.' });
    }

    const file = order.Product.downloadFile;

    if (!file || !file.googleDriveLink) {
      return res.status(404).render('error', { message: 'Không tìm thấy link tải.' });
    }

    res.redirect(file.googleDriveLink);
  } catch (error) {
    console.error('Lỗi trong /download:', error.message, error.stack);
    res.status(500).render('error', { message: 'Lỗi server khi tải file.' });
  }
});

// Route danh sách file đã mua
router.get('/my-downloads', requireLogin, async (req, res) => {
  try {
    const user = res.locals.user;
    const orders = await Order.findAll({
      where: { userId: user.id },
      include: [
        {
          model: Product,
          include: [{ model: DownloadFile, as: 'downloadFile' }],
        },
      ],
    });

    res.render('my-downloads', { orders, user });
  } catch (error) {
    console.error('Lỗi trong /my-downloads:', error.message, error.stack);
    res.status(500).render('error', { message: 'Lỗi server khi lấy danh sách tải về.' });
  }
});

export default router;