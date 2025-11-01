// Pruebas funcionales de CRUD de productos
const request = require('supertest');
const app = require('../../../src/app');
const { sequelize } = require('../../../src/config/database');
const Product = require('../../../src/models/product.model');

describe('Funcional: Productos CRUD', () => {
  beforeAll(async () => {
    await sequelize.sync({ force: true });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  it('POST /api/v1/product - crea un producto', async () => {
    const res = await request(app)
      .post('/api/v1/product')
      .send({ nombre: 'Prod A', descripcion: 'Desc', stock: 5, precio: 10.5 });
    expect(res.statusCode).toBe(201);
    expect(res.body.product).toHaveProperty('id');
  });

  it('POST /api/v1/product - falla con stock negativo', async () => {
    const res = await request(app)
      .post('/api/v1/product')
      .send({ nombre: 'X', stock: -1, precio: 10 });
    expect(res.statusCode).toBe(400);
  });

  it('GET /api/v1/product/:id - obtiene por ID', async () => {
    const created = await Product.create({ nombre: 'Prod B', stock: 2, precio: 20 });
    const res = await request(app).get(`/api/v1/product/${created.id}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.id).toBe(created.id);
  });

  it('GET /api/v1/product/:id - 404 si no existe', async () => {
    const res = await request(app).get('/api/v1/product/99999');
    expect(res.statusCode).toBe(404);
  });

  it('GET /api/v1/product - pagina resultados e incluye metadatos', async () => {
    await Product.bulkCreate([
      { nombre: 'P1', stock: 1, precio: 1 },
      { nombre: 'P2', stock: 1, precio: 1 },
      { nombre: 'P3', stock: 1, precio: 1 },
    ]);
    const res = await request(app).get('/api/v1/product?page=1&per_page=2');
    expect(res.statusCode).toBe(200);
    expect(res.body.pagination).toMatchObject({ page: 1, per_page: 2 });
    expect(Array.isArray(res.body.products)).toBe(true);
  });

  it('PUT /api/v1/product/:id - actualiza un producto', async () => {
    const product = await Product.create({ nombre: 'Prod C', stock: 3, precio: 30 });
    const res = await request(app)
      .put(`/api/v1/product/${product.id}`)
      .send({ stock: 10, precio: 15.555 });
    expect(res.statusCode).toBe(200);
    expect(res.body.product.stock).toBe(10);
    expect(res.body.product.precio).toBe(15.56);
  });

  it('PUT /api/v1/product/:id - 400 si el body está vacío', async () => {
    const product = await Product.create({ nombre: 'Prod D', stock: 1, precio: 5 });
    const res = await request(app)
      .put(`/api/v1/product/${product.id}`)
      .send({});
    expect(res.statusCode).toBe(400);
  });

  it('DELETE /api/v1/product/:id - elimina un producto', async () => {
    const product = await Product.create({ nombre: 'ToDelete', stock: 1, precio: 1 });
    const res = await request(app).delete(`/api/v1/product/${product.id}`);
    expect(res.statusCode).toBe(200);
    const getRes = await request(app).get(`/api/v1/product/${product.id}`);
    expect(getRes.statusCode).toBe(404);
  });
});


