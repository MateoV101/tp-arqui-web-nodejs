// Pruebas unitarias del modelo Product y sus validaciones
const { sequelize } = require('../../../src/config/database');
const Product = require('../../../src/models/product.model');

describe('Unitario: Validaciones del modelo Product', () => {
  beforeAll(async () => {
    await sequelize.sync({ force: true });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  it('requiere nombre', async () => {
    await expect(Product.create({ stock: 1, precio: 1 })).rejects.toBeTruthy();
  });

  it('rechaza stock negativo', async () => {
    await expect(Product.create({ nombre: 'X', stock: -1, precio: 1 })).rejects.toBeTruthy();
  });

  it('rechaza precio no positivo', async () => {
    await expect(Product.create({ nombre: 'Y', stock: 1, precio: 0 })).rejects.toBeTruthy();
  });

  it('crea un producto válido', async () => {
    const p = await Product.create({ nombre: 'OK', stock: 1, precio: 9.99 });
    expect(p.id).toBeDefined();
  });
});


