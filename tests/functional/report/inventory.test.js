// Pruebas funcionales del reporte de inventario
const request = require('supertest');
const app = require('../../../src/app');
const { sequelize } = require('../../../src/config/database');
const Product = require('../../../src/models/product.model');

describe('Funcional: Reporte de inventario', () => {
  beforeAll(async () => {
    await sequelize.sync({ force: true });
    await Product.bulkCreate([
      { nombre: 'A', stock: 5, precio: 10 },
      { nombre: 'B', stock: 50, precio: 20 },
      { nombre: 'C', stock: 8, precio: 30 },
    ]);
  });

  afterAll(async () => {
    await sequelize.close();
  });

  it('GET /api/v1/report/inventory - devuelve estadísticas', async () => {
    const res = await request(app).get('/api/v1/report/inventory?low_stock_threshold=10');
    expect(res.statusCode).toBe(200);
    expect(res.body.total_products).toBe(3);
    expect(res.body.total_items_in_stock).toBe(63);
    expect(res.body.total_inventory_value).toBe(1290);
    expect(res.body.low_stock_count).toBe(2);
  });

  it('GET /api/v1/report/inventory - pagina productos con bajo stock', async () => {
    const res = await request(app).get('/api/v1/report/inventory?low_stock_threshold=10&page=1&per_page=1');
    expect(res.statusCode).toBe(200);
    expect(res.body.low_stock_products).toHaveLength(1);
    expect(res.body.pagination.total_pages).toBe(2);
  });

  it('GET /api/v1/report/inventory - 400 si threshold inválido', async () => {
    const res = await request(app).get('/api/v1/report/inventory?low_stock_threshold=-1');
    expect(res.statusCode).toBe(400);
  });
});


