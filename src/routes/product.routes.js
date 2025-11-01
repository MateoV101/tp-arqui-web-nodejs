const express = require('express');
const controller = require('../controllers/product.controller');
const { validateCreate, validateUpdate } = require('../middleware/validation');

const router = express.Router();

router.route('/')
  .get(controller.getAllProducts)
  .post(validateCreate, controller.createProduct);

router.route('/:id')
  .get(controller.getProductById)
  .put(validateUpdate, controller.updateProduct)
  .delete(controller.deleteProduct);

module.exports = router;

