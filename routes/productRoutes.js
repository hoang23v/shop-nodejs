import express from 'express';
import upload from '../middlewares/upload.js';
import { createProduct, getAllProducts, deleteProduct, getProductById } from '../controllers/productController.js';

const router = express.Router();

router.post('/', upload.array('images', 5), createProduct);
router.get('/', getAllProducts);
router.delete('/:id', deleteProduct);
router.get('/:id', getProductById);

export default router;
