import express from 'express';
import Product from '../models/Product.js';
import Image from '../models/Image.js';
import Account from '../models/Account.js';

const router = express.Router();

// Route danh sách sản phẩm
router.get('/', async (req, res) => {
  try {
    const products = await Product.findAll({
      include: [{ model: Image, as: 'images' }],
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

    res.render('products', { products, user });
  } catch (error) {
    console.error('Lỗi khi lấy danh sách sản phẩm:', error.message, error.stack);
    res.status(500).render('error', { message: 'Lỗi server khi lấy sản phẩm.' });
  }
});

// Route chi tiết sản phẩm
router.get('/product/:id', async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id, {
      include: [{ model: Image, as: 'images' }],
    });

    if (!product) {
      return res.status(404).render('error', { message: 'Không tìm thấy sản phẩm.' });
    }

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

    res.render('product-detail', { product, user });
  } catch (error) {
    console.error('Lỗi khi lấy sản phẩm:', error.message, error.stack);
    res.status(500).render('error', { message: 'Lỗi server khi lấy sản phẩm.' });
  }
});

export default router;