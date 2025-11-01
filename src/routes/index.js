const express = require('express');
const productRoutes = require('./product.routes');
const reportRoutes = require('./report.routes');

const router = express.Router();

router.get('/ping', (req, res) => {
    res.json({ message: 'pong' });
  });
router.use('/v1/product', productRoutes);
router.use('/v1/report', reportRoutes);

module.exports = router;
