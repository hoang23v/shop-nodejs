import express from 'express';
import upload from '../middlewares/upload.js';
import Product from '../models/Product.js';
import Image from '../models/Image.js';
import DownloadFile from '../models/DownloadFile.js';
import { restrictToAdmin } from '../middlewares/auth.js';
import { renderAddProduct, addProduct, getProducts, deleteProduct } from '../controllers/adminController.js';
import { getUsers, addMoney, deductMoney } from '../controllers/userController.js';
const router = express.Router();

router.get('/add-product',restrictToAdmin, (req, res) => {
  res.render('admin/add-product');
});

router.post('/add-product', upload.fields([
  { name: 'images', maxCount: 5 },
  { name: 'download', maxCount: 1 }
]), addProduct);

router.get('/products', getProducts);

router.delete('/delete-product/:id', deleteProduct);

// User management routes
router.get('/users', restrictToAdmin, getUsers);
router.post('/users/add-money', restrictToAdmin, addMoney);
router.post('/users/deduct-money', restrictToAdmin, deductMoney);

export default router;
