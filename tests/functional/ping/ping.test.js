// Prueba funcional simple de salud (ping)
const request = require('supertest');
const app = require('../../../src/app');

describe('Funcional: Ping', () => {
  it('GET /api/ping devuelve pong', async () => {
    const res = await request(app).get('/api/ping');
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('pong');
  });
});


