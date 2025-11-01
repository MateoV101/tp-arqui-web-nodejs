const ProductService = require('../services/product.service');
const config = require('../config/config');

exports.getInventoryReport = async (req, res) => {
  try {
    const { low_stock_threshold = '10', page = 1, per_page = config.DEFAULT_PAGE_SIZE } = req.query;
    const threshold = parseInt(low_stock_threshold, 10);
    const pageNum = parseInt(page, 10);
    const perPageNum = parseInt(per_page, 10);

    if (Number.isNaN(threshold) || threshold < 0) {
      return res.status(400).json({ error: 'low_stock_threshold debe ser >= 0' });
    }
    if (pageNum < 1) {
      return res.status(400).json({ error: 'El número de página debe ser >= 1' });
    }
    if (perPageNum < 1 || perPageNum > config.MAX_PAGE_SIZE) {
      return res.status(400).json({ error: `per_page debe estar entre 1 y ${config.MAX_PAGE_SIZE}` });
    }

    const report = await ProductService.getInventoryReport(threshold, pageNum, perPageNum);
    res.status(200).json(report);
  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor', message: error.message });
  }
};


