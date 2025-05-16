const express = require('express');
const cors = require('cors');
const sequelize = require('./config/database');
const Product = require('./models/Product');
const productRoutes = require('./routes/productRoutes');
const viewRoutes = require('./routes/viewRoutes');
const adminRoutes = require('./routes/adminRoutes');
const path = require('path');

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads')); 
app.use('/api/products', productRoutes);
app.use('/admin', adminRoutes);
app.use('/', viewRoutes); 
sequelize.sync()
  .then(() => console.log('✅ Kết nối DB thành công'))
  .catch(err => console.error('❌ Lỗi DB:', err));

app.listen(3000, () => {
  console.log('🚀 Server chạy tại http://localhost:3000');
});
