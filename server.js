import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

import sequelize from './config/database.js';
import initializeAssociations from './models/associations.js'; 

import Product from './models/Product.js';
import DownloadFile from './models/DownloadFile.js';
import Order from './models/Order.js';

import productRoutes from './routes/productRoutes.js';
import viewRoutes from './routes/viewRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import buyRoutes from './routes/shop.js';
import authRoutes from './routes/authRoutes.js';
import session from 'express-session';
import { setUser } from './middlewares/auth.js';

const app = express();


app.use(session({
  secret: '8HUILH8;p92@@fL:qkjHHUIHiohihi2hul2kr',  
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 60 * 60 * 1000, 
    httpOnly: true,        
  },
}));

// __dirname trong ES Module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


// Cài đặt view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
// Middleware
app.use('/uploads', express.static(path.join(__dirname, 'Uploads')));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(setUser);
// Đăng ký các route
app.use('/api/products', productRoutes);
app.use('/admin', adminRoutes);
app.use('/', viewRoutes);
app.use('/', buyRoutes);
app.use('/', authRoutes);

// Middleware xử lý lỗi chung
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).render('error', { message: 'Something went wrong!' });
});

// Khởi tạo DB và server
(async () => {
  try {
    initializeAssociations(); // Khởi tạo quan hệ các model
    await sequelize.sync({ force: false });
    console.log('✅ Kết nối DB thành công');

    app.listen(3000, () => {
      console.log('🚀 Server chạy tại http://localhost:3000');
    });
  } catch (err) {
    console.error('❌ Lỗi DB:', err);
  }
})();
