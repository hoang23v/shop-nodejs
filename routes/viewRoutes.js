import { Router } from 'express';
import { Op } from 'sequelize';
import Product from '../models/Product.js';
import Image from '../models/Image.js';

const router = Router();

// Route danh sách sản phẩm
router.get('/', async (req, res) => {
  try {
    const { search } = req.query;
    let products;

    if (search) {
      products = await Product.findAll({
        where: {
          name: {
            [Op.iLike]: `%${search}%`, // Tìm kiếm không phân biệt hoa thường
          },
        },
        include: [{ model: Image, as: 'images' }],
      });
    } else {
      products = await Product.findAll({
        include: [{ model: Image, as: 'images' }],
      });
    }

    // res.locals.user đã được set bởi middleware setUser
    res.render('products', {
      products,
      search: search || '',
    });
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

    // res.locals.user đã được set bởi middleware setUser
    res.render('product-detail', { product });
  } catch (error) {
    console.error('Lỗi khi lấy sản phẩm:', error.message, error.stack);
    res.status(500).render('error', { message: 'Lỗi server khi lấy sản phẩm.' });
  }
});

export default router;