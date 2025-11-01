const { Op, fn, literal } = require('sequelize');
const Product = require('../models/product.model');

class ProductService {
  static async getAllProducts(page = 1, perPage = 10, nombreFilter) {
    const options = {
      order: [['id', 'ASC']],
      offset: (page - 1) * perPage,
      limit: perPage,
      where: {},
    };

    if (nombreFilter) {
      options.where.nombre = {
        [Op.like]: `%${nombreFilter}%`,
      };
    }

    const { count, rows } = await Product.findAndCountAll(options);

    return {
      products: rows.map(p => p.toJSON()),
      pagination: {
        page: page,
        per_page: perPage,
        total_items: count,
        total_pages: Math.ceil(count / perPage),
        has_next: (page * perPage) < count,
        has_prev: page > 1,
      },
    };
  }

  static async getProductById(productId) {
    return await Product.findByPk(productId);
  }

  static async createProduct(data) {
    const precio = Math.round(data.precio * 100) / 100;
    return await Product.create({
      nombre: data.nombre,
      descripcion: data.descripcion,
      stock: data.stock,
      precio: precio,
    });
  }

  static async updateProduct(productId, data) {
    const product = await Product.findByPk(productId);
    if (!product) {
      return null;
    }
    if (data.precio !== undefined) {
      data.precio = Math.round(data.precio * 100) / 100;
    }
    await product.update(data);
    return product;
  }

  static async deleteProduct(productId) {
    const product = await Product.findByPk(productId);
    if (!product) {
      return false;
    }
    await product.destroy();
    return true;
  }

  static async getInventoryReport(lowStockThreshold, page = 1, perPage = 10) {
    const totalProducts = await Product.count();

    const totalValueResult = await Product.findOne({
      attributes: [[fn('SUM', literal('stock * precio')), 'totalValue']],
      raw: true,
    });
    const totalValue = parseFloat(totalValueResult.totalValue || 0);

    const totalItemsInStock = (await Product.sum('stock')) || 0;

    const lowStockOptions = {
      where: {
        stock: { [Op.lt]: lowStockThreshold },
      },
      order: [['stock', 'ASC']],
      offset: (page - 1) * perPage,
      limit: perPage,
    };

    const { count: lowStockCount, rows: lowStockProducts } =
      await Product.findAndCountAll(lowStockOptions);

    return {
      total_products: totalProducts,
      total_items_in_stock: totalItemsInStock,
      total_inventory_value: Math.round(totalValue * 100) / 100,
      low_stock_threshold: lowStockThreshold,
      low_stock_count: lowStockCount,
      low_stock_products: lowStockProducts.map(p => p.toJSON()),
      pagination: {
        page: page,
        per_page: perPage,
        total_items: lowStockCount,
        total_pages: Math.ceil(lowStockCount / perPage),
        has_next: (page * perPage) < lowStockCount,
        has_prev: page > 1,
      },
    };
  }
}

module.exports = ProductService;

