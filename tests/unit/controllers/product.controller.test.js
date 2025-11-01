// Pruebas unitarias del controlador de productos
jest.mock('../../../src/services/product.service');
const ProductService = require('../../../src/services/product.service');
const controller = require('../../../src/controllers/product.controller');
const config = require('../../../src/config/config');

function mockRes() {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
}

describe('Unitario: product.controller', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('getAllProducts valida paginación', async () => {
    const req = { query: { page: '0', per_page: String(config.DEFAULT_PAGE_SIZE) } };
    const res = mockRes();
    await controller.getAllProducts(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it('getProductById devuelve 404 si no existe', async () => {
    ProductService.getProductById.mockResolvedValue(null);
    const req = { params: { id: '999' } };
    const res = mockRes();
    await controller.getProductById(req, res);
    expect(res.status).toHaveBeenCalledWith(404);
  });

  it('getProductById devuelve el producto si existe', async () => {
    ProductService.getProductById.mockResolvedValue({ toJSON: () => ({ id: 1, nombre: 'X' }) });
    const req = { params: { id: '1' } };
    const res = mockRes();
    await controller.getProductById(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ id: 1, nombre: 'X' });
  });
});


