const express = require('express');
const router = express.Router();
const upload = require('../middlewares/upload');
const { createProduct, getAllProducts, deleteProduct, getProductById } = require('../controllers/productController');


router.post('/', upload.array('images', 5), createProduct);

router.get('/', getAllProducts); 
router.delete('/:id', deleteProduct);
router.get('/:id', getProductById);


module.exports = router;
