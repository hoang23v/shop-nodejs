import path from 'path';
import { fileURLToPath } from 'url';
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import DownloadFile from '../models/DownloadFile.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const buyProduct = async (req, res) => {
  try {
    const user = res.locals.user; // Lấy từ middleware requireLogin
    if (!user) return res.redirect('/login');

    const product = await Product.findByPk(req.params.productId, {
      include: [{ model: DownloadFile, as: 'downloadFile' }],
    });

    if (!product) {
      return res.status(404).render('error', { message: 'Sản phẩm không tồn tại.' });
    }

    if (product.stock <= 0) {
      return res.status(400).render('error', { message: 'Sản phẩm đã hết hàng.' });
    }

    if (user.balance < product.price) {
      return res.status(400).render('error', { message: 'Số dư không đủ để mua sản phẩm.' });
    }

    // Trừ tiền và tạo đơn hàng (có thể dùng transaction nếu cần)
    user.balance -= product.price;
    await user.save();

    await Order.create({ userId: user.id, productId: product.id });

    await product.decrement('stock');

    res.redirect('/my-downloads');
  } catch (error) {
    console.error('Lỗi trong buyProduct:', error);
    res.status(500).render('error', { message: 'Lỗi server khi mua sản phẩm.' });
  }
};

export const downloadFile = async (req, res) => {
  try {
    const user = res.locals.user;
    if (!user) return res.redirect('/login');

    const filename = req.params.filename;

    const order = await Order.findOne({
      where: { userId: user.id },
      include: [
        {
          model: Product,
          as: 'orderedProduct',
          include: [
            {
              model: DownloadFile,
              as: 'downloadFile',
              where: { filename },
            },
          ],
        },
      ],
    });

    if (!order || !order.orderedProduct || !order.orderedProduct.downloadFile) {
      return res.status(403).render('error', { message: 'Bạn không có quyền tải file này.' });
    }

    const file = order.orderedProduct.downloadFile;

    if (file.googleDriveLink) {
      return res.redirect(file.googleDriveLink);
    }

    const filePath = path.join(__dirname, '../Uploads', filename);

    res.download(filePath, (err) => {
      if (err) {
        console.error('Lỗi tải file:', err);
        return res.status(500).render('error', { message: 'Lỗi khi tải file.' });
      }
    });
  } catch (error) {
    console.error('Lỗi trong downloadFile:', error);
    res.status(500).render('error', { message: 'Lỗi server khi tải file.' });
  }
};

export const getMyDownloads = async (req, res) => {
  try {
    const user = res.locals.user;
    if (!user) return res.redirect('/login');

    const orders = await Order.findAll({
      where: { userId: user.id },
      include: [
        {
          model: Product,
          as: 'orderedProduct',
          include: [{ model: DownloadFile, as: 'downloadFile' }],
        },
      ],
    });

    res.render('my-downloads', { orders, user });
  } catch (error) {
    console.error('Lỗi trong getMyDownloads:', error);
    res.status(500).render('error', { message: 'Lỗi server khi lấy danh sách tải về.' });
  }
};
