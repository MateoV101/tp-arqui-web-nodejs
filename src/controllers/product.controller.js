const ProductService = require('../services/product.service');
const config = require('../config/config');
const { validationResult } = require('express-validator');

exports.getAllProducts = async (req, res) => {
  try {
    const { page = 1, per_page = config.DEFAULT_PAGE_SIZE, nombre } = req.query;
    const pageNum = parseInt(page, 10);
    const perPageNum = parseInt(per_page, 10);

    if (pageNum < 1) {
      return res.status(400).json({ error: 'El número de página debe ser >= 1' });
    }
    if (perPageNum < 1 || perPageNum > config.MAX_PAGE_SIZE) {
      return res.status(400).json({ error: `per_page debe estar entre 1 y ${config.MAX_PAGE_SIZE}` });
    }

    const result = await ProductService.getAllProducts(pageNum, perPageNum, nombre);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor', message: error.message });
  }
};

exports.createProduct = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ error: 'Datos de entrada inválidos', details: errors.array() });
  }
  try {
    const product = await ProductService.createProduct(req.body);
    res.status(201).json({
      message: 'Producto creado exitosamente',
      product: product.toJSON(),
    });
  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor', message: error.message });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await ProductService.getProductById(parseInt(id, 10));
    if (!product) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }
    res.status(200).json(product.toJSON());
  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor', message: error.message });
  }
};

exports.updateProduct = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ error: 'Datos de entrada inválidos', details: errors.array() });
  }
  try {
    const { id } = req.params;
    if (Object.keys(req.body).length === 0) {
      return res.status(400).json({ error: 'Se requiere al menos un campo para actualizar' });
    }
    const product = await ProductService.updateProduct(parseInt(id, 10), req.body);
    if (!product) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }
    res.status(200).json({
      message: 'Producto actualizado exitosamente',
      product: product.toJSON(),
    });
  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor', message: error.message });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await ProductService.deleteProduct(parseInt(id, 10));
    if (!deleted) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }
    res.status(200).json({ message: 'Producto eliminado exitosamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor', message: error.message });
  }
};


