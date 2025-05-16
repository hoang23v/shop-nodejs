const express = require('express');
const router = express.Router();
const upload = require('../middlewares/upload');
const { createProduct, getAllProducts, deleteProduct, getProductById } = require('../controllers/productController');


router.post('/', upload.single('image'), createProduct);
router.get('/', getAllProducts); 
router.delete('/:id', deleteProduct);
router.get('/:id', getProductById);


module.exports = router;
