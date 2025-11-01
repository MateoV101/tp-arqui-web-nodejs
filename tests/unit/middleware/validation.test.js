// Pruebas unitarias del middleware de validación (express-validator)
const { validationResult } = require('express-validator');
const { validateCreate, validateUpdate } = require('../../../src/middleware/validation');

async function runValidators(validators, body) {
  const req = { body };
  for (const v of validators) {
    // Cada validador expone run(req); algunos pueden no tenerla, por eso el guard
    if (typeof v.run === 'function') {
      // eslint-disable-next-line no-await-in-loop
      await v.run(req);
    }
  }
  return validationResult(req);
}

describe('Unitario: middleware de validación', () => {
  it('validateCreate rechaza campos faltantes', async () => {
    const result = await runValidators(validateCreate, { nombre: 'A' });
    expect(result.isEmpty()).toBe(false);
  });

  it('validateCreate acepta un payload válido', async () => {
    const result = await runValidators(validateCreate, { nombre: 'A', stock: 1, precio: 1.5 });
    expect(result.isEmpty()).toBe(true);
  });

  it('validateUpdate permite parcial pero rechaza valores inválidos', async () => {
    let result = await runValidators(validateUpdate, { stock: -1 });
    expect(result.isEmpty()).toBe(false);

    result = await runValidators(validateUpdate, { precio: 2 });
    expect(result.isEmpty()).toBe(true);
  });
});


