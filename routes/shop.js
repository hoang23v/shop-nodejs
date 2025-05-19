import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import DownloadFile from '../models/DownloadFile.js';
import Account from '../models/Account.js';
import { sendProductEmail } from '../services/sendMail.js'; 

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Route danh sách sản phẩm (home page)
router.get('/', async (req, res) => {
  try {
    const products = await Product.findAll({
      include: [{ model: DownloadFile, as: 'downloadFile' }, { model: Image, as: 'images' }],
    });

    let user = null;
    if (req.session.userEmail) {
      const account = await Account.findOne({
        where: { email: req.session.userEmail },
        attributes: { exclude: ['password'] }, // Exclude password
      });
      if (account) {
        // Parse purchasedServices if it's a string
        let purchasedServices = account.purchasedServices;
        if (typeof purchasedServices === 'string') {
          try {
            purchasedServices = JSON.parse(purchasedServices);
          } catch (e) {
            console.error('Error parsing purchasedServices:', e);
            purchasedServices = [];
          }
        }
        if (!Array.isArray(purchasedServices)) {
          purchasedServices = [];
        }
        user = {
          username: account.username,
          email: account.email,
          balance: account.balance,
          purchasedServices,
        };
      }
    }

    res.render('index', { products, user });
  } catch (error) {
    console.error('Lỗi trong /:', error.message, error.stack);
    res.status(500).render('error', { message: 'Lỗi server khi lấy danh sách sản phẩm.' });
  }
});

// Route mua hàng
router.post('/buy/:productId', async (req, res) => {
  if (!req.session.userEmail) {
    return res.redirect('/login');
  }

  try {
    const user = await Account.findOne({ where: { email: req.session.userEmail } });
    if (!user) {
      return res.redirect('/login');
    }

    const userId = user.id;
    const userEmail = user.email;

    const product = await Product.findByPk(req.params.productId, {
      include: [{ model: DownloadFile, as: 'downloadFile' }],
    });

    if (!product) {
      return res.status(404).render('error', { message: 'Sản phẩm không tồn tại.' });
    }

    if (product.stock <= 0) {
      return res.status(400).render('error', { message: 'Sản phẩm đã hết hàng.' });
    }

    await Order.create({ userId, productId: product.id });

    await product.decrement('stock');

    await sendProductEmail(userEmail, product, product.downloadFile);

    res.redirect('/my-downloads?purchased=true');
  } catch (error) {
    console.error('Lỗi trong /buy:', error.message, error.stack);
    res.status(500).render('error', { message: 'Lỗi server khi mua sản phẩm.' });
  }
});

// Route tải file theo productId
router.get('/download/:productId', async (req, res) => {
  if (!req.session.userEmail) {
    return res.redirect('/login');
  }

  try {
    const user = await Account.findOne({ where: { email: req.session.userEmail } });
    if (!user) {
      return res.redirect('/login');
    }

    const userId = user.id;
    const productId = req.params.productId;

    const order = await Order.findOne({
      where: { userId, productId },
      include: [{
        model: Product,
        include: [{ model: DownloadFile, as: 'downloadFile' }],
      }],
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
router.get('/my-downloads', async (req, res) => {
  if (!req.session.userEmail) {
    return res.redirect('/login');
  }

  try {
    const user = await Account.findOne({
      where: { email: req.session.userEmail },
      attributes: { exclude: ['password'] },
    });
    if (!user) {
      return res.redirect('/login');
    }

    let purchasedServices = user.purchasedServices;
    if (typeof purchasedServices === 'string') {
      try {
        purchasedServices = JSON.parse(purchasedServices);
      } catch (e) {
        console.error('Error parsing purchasedServices:', e);
        purchasedServices = [];
      }
    }
    if (!Array.isArray(purchasedServices)) {
      purchasedServices = [];
    }

    const orders = await Order.findAll({
      where: { userId: user.id },
      include: [
        {
          model: Product,
          include: [{ model: DownloadFile, as: 'downloadFile' }],
        },
      ],
    });

    res.render('my-downloads', {
      orders,
      user: {
        username: user.username,
        email: user.email,
        balance: user.balance,
        purchasedServices,
      },
    });
  } catch (error) {
    console.error('Lỗi trong /my-downloads:', error.message, error.stack);
    res.status(500).render('error', { message: 'Lỗi server khi lấy danh sách tải về.' });
  }
});

export default router;